/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { React, SelectedChannelStore } from "@webpack/common";

let channelId: string | null = null;
let timestamp: number | null = null;
let interval: NodeJS.Timeout | null = null;

const hookSubscribers = new Set<() => void>();

function notifySubscribers() {
    hookSubscribers.forEach(i => i());
}

function updateCallTimer() {
    const newChannelId = SelectedChannelStore.getVoiceChannelId() ?? null;
    if (newChannelId === channelId) return;

    if (interval !== null) {
        clearInterval(interval);
        interval = null;
    }
    if (newChannelId) {
        timestamp = Date.now();
        notifySubscribers();
        interval = setInterval(notifySubscribers, 100);
    } else {
        timestamp = null;
        notifySubscribers();
    }

    channelId = newChannelId;
}

export function useCallTimer() {
    return React.useSyncExternalStore(update => {
        hookSubscribers.add(update);
        return () => hookSubscribers.delete(update);
    }, () => {
        if (timestamp === null) return null;
        return Date.now() - timestamp;
    });
}

export function startCallTimerSubscription() {
    SelectedChannelStore.addChangeListener(updateCallTimer);
}
export function stopCallTimerSubscription() {
    SelectedChannelStore.removeChangeListener(updateCallTimer);
}
