/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findByPropsLazy, findStoreLazy } from "@webpack";
import { ChannelStore, GuildStore } from "@webpack/common";
import { Message } from "discord-types/general";

const RecentMentionsStore = findStoreLazy("RecentMentionsStore");

const UserGuildSettingsStore = findStoreLazy("UserGuildSettingsStore");

const RecentMentionsManager = findByPropsLazy("fetchRecentMentions", "deleteRecentMention");

export interface FeedEntry {
    label: string;
    timestamp: Date;
    message: Message;
    delete: () => void;
}

export const { fetchRecentMentions } = RecentMentionsManager;

export default function feedProvider(): FeedEntry[] {
    const entries: FeedEntry[] = [];
    entries.push(...(RecentMentionsStore.getMentions() || []).map((m: Message) => {
        const channel = ChannelStore.getChannel(m.getChannelId());
        const guild = GuildStore.getGuild(channel.getGuildId());
        return {
            message: m,
            // discord-types fix please thanks
            timestamp: m.timestamp as unknown as Date,
            label: `Mention in ${guild ? guild.name + " " : ""} #${channel.name}`,
            delete: () => RecentMentionsManager.deleteRecentMention(m.id)
        } as FeedEntry;
    }));

    // entries.push(...ReadStateStore.getAllReadStates().filter(rs => {
    //     if (ReadStateStore.hasUnread(rs.channelId)) return false;
    //     const channel = ChannelStore.getChannel(rs.channelId);
    //     const guild = GuildStore.getGuild(channel?.getGuildId());
    //     if (!guild) return true;
    //     return !UserGuildSettingsStore.isChannelMuted(guild.id, channel.id) &&
    //         (UserGuildSettingsStore.resolvedMessageNotifications(channel) === 0);
    // }).map(rs => {
    //     const chId = rs.channelId;
    //     console.warn(chId);
    //     const mId = rs._ackMessageId;// ReadStateStore.getOldestUnreadMessageId(chId);
    //     if (!mId) return null;
    //     return MessageStore.getMessage(chId, mId);
    // }).filter(Boolean).map((m: Message) => {
    //     const channel = ChannelStore.getChannel(m.getChannelId());
    //     const guild = GuildStore.getGuild(channel.getGuildId());
    //     return {
    //         message: m,
    //         // discord-types fix please thanks
    //         timestamp: m.timestamp as unknown as Date,
    //         label: `Unread message in ${guild ? guild.name + " " : ""} #${channel.name}`,
    //         delete: () => null
    //     } as FeedEntry;
    // }));

    return entries.sort((a, b) => {
        return (b.timestamp as unknown as number) - (a.timestamp as unknown as number);
    });
}
