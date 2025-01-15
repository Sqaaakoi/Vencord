/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findStoreLazy } from "@webpack";
import { FluxDispatcher, useStateFromStores } from "@webpack/common";

const MobileWebSidebarStore = findStoreLazy("MobileWebSidebarStore");

export function openSidebar() {
    FluxDispatcher.dispatch({
        type: "MOBILE_WEB_SIDEBAR_OPEN",
        force: true
    });
}

export function closeSidebar() {
    FluxDispatcher.dispatch({
        type: "MOBILE_WEB_SIDEBAR_CLOSE",
        force: true
    });
}

export function toggleSidebar() {
    MobileWebSidebarStore.getIsOpen() ? closeSidebar() : openSidebar();
}

export function useSidebar() {
    return useStateFromStores([MobileWebSidebarStore], () => MobileWebSidebarStore.getIsOpen());
}

export function keybindHandler(e: KeyboardEvent) {
    const hasMod = navigator.platform.includes("Mac") ? e.metaKey : e.ctrlKey;
    const hasMeta = navigator.platform.includes("Mac") ? e.ctrlKey : e.metaKey;
    if (hasMod && !hasMeta && !e.shiftKey && !e.altKey && ["\\", "ContextMenu"].includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
    }
}
