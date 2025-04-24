/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findGroupChildrenByChildId, NavContextMenuPatchCallback } from "@api/ContextMenu";
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { useForceUpdater } from "@utils/react";
import definePlugin, { OptionType } from "@utils/types";
import { findStoreLazy } from "@webpack";
import { ChannelStore, ContextMenuApi, Menu, MessageStore, PresenceStore, PrivateChannelsStore, RelationshipStore, UserStore, useStateFromStores } from "@webpack/common";
import { Channel, Message, User } from "discord-types/general";
import { MouseEvent } from "react";

enum UnreadDMsPosition {
    Above = "above",
    Below = "below",
}

const settings = definePluginSettings({
    unreadDMsPosition: {
        description: "Position to insert new, unread DMs",
        type: OptionType.SELECT,
        options: [
            { label: "Above", value: UnreadDMsPosition.Above },
            { label: "Below", value: UnreadDMsPosition.Below, default: true },
        ],
    },
    channelIDList: {
        description: "List of (ordered) channel IDs, separated by commas",
        type: OptionType.STRING,
        default: "",
    },
    keepForSeconds: {
        description: "Unread DMs will stay in the sidebar for this many seconds after being marked as read",
        type: OptionType.NUMBER,
        default: 60
    },
    keepRecentDMCount: {
        description: "Number of recent DMs to always keep in the sidebar",
        type: OptionType.NUMBER,
        default: 3
    },
    keepRecentDmsVisible: {
        description: "Show recent DMs in the sidebar",
        type: OptionType.BOOLEAN,
        default: false
    },
    onlineMembersOnly: {
        description: "Only show pinned DMs of users that are online or where at least one member in a group is online",
        type: OptionType.BOOLEAN,
        default: false
    },
    showRecentBots: {
        description: "Show recent bots/apps",
        type: OptionType.BOOLEAN,
        default: true
    }
});

const contextMenuPatch: NavContextMenuPatchCallback = (children, props) => {
    const { channelIDList } = settings.use(["channelIDList"]);
    if (!props) return;
    const { user, channel }: { user: User; channel: Channel; } = props;
    const group = findGroupChildrenByChildId(["close-dm", "leave-channel"], children);
    const cachedChannelId = user ? ChannelStore.getDMFromUserId(user?.id) : channel?.id;
    const enabled = !!cachedChannelId && channelIDList.split(",").map(id => id.trim()).includes(cachedChannelId);
    if (group)
        group.push(
            <Menu.MenuCheckboxItem
                label="Pin to Sidebar"
                id="toggle-pinned-to-sidebar"
                key="toggle-pinned-to-sidebar"
                checked={enabled}
                action={async () => {
                    const channelId = cachedChannelId || (user ? await PrivateChannelsStore.getOrEnsurePrivateChannel(user?.id) : null);
                    if (!channelId) return;
                    const old = channelIDList.split(",").map(id => id.trim()).filter(id => id.length > 0);
                    settings.store.channelIDList = (enabled ? old.filter(id => id !== channelId) : [...old, channelId]).join(",");
                }}
            />
        );
};

function openSettingsContextMenu(e: MouseEvent) {
    let actionTaken = false;
    if (e.ctrlKey) {
        settings.store.onlineMembersOnly = !settings.store.onlineMembersOnly;
        actionTaken = true;
    }
    if (navigator.platform.includes("Mac") ? e.metaKey : e.altKey) {
        settings.store.keepRecentDmsVisible = !settings.store.keepRecentDmsVisible;
        actionTaken = true;
    }
    if (actionTaken) {
        e.preventDefault();
        return;
    }
    ContextMenuApi.openContextMenu(e, () => {
        const { channelIDList, keepRecentDmsVisible, onlineMembersOnly, showRecentBots } = settings.use(["channelIDList", "keepRecentDmsVisible", "onlineMembersOnly", "showRecentBots"]);
        return <Menu.Menu
            navId="vc-keepDMsInSidebar-settings"
            onClose={ContextMenuApi.closeContextMenu}
        >
            <Menu.MenuGroup label="Keep DMs in Sidebar">
                <Menu.MenuCheckboxItem
                    id="online-only"
                    label="Online users/groups only"
                    checked={onlineMembersOnly}
                    action={() => settings.store.onlineMembersOnly = !onlineMembersOnly}
                />
                <Menu.MenuCheckboxItem
                    id="recent-dm-enabled"
                    label="Show recent DMs"
                    checked={keepRecentDmsVisible}
                    action={() => settings.store.keepRecentDmsVisible = !keepRecentDmsVisible}
                />
                <Menu.MenuControlItem
                    id="recent-dm-count"
                    label="Recent DMs count"
                    control={(props, ref) => (
                        <Menu.MenuSliderControl
                            ref={ref}
                            {...props}
                            minValue={1}
                            maxValue={20}
                            value={settings.store.keepRecentDMCount}
                            renderValue={v => Math.round(v).toString()}
                            onChange={v => settings.store.keepRecentDMCount = Math.round(v)}
                        />
                    )}
                />
                <Menu.MenuCheckboxItem
                    id="show-bots"
                    label="Show recent bots"
                    checked={showRecentBots}
                    action={() => settings.store.showRecentBots = !showRecentBots}
                />
                <Menu.MenuItem
                    id="clear"
                    label="Clear pinned DMs"
                    color="danger"
                    disabled={!channelIDList.length}
                    action={() => settings.store.channelIDList = ""}
                />
            </Menu.MenuGroup>
        </Menu.Menu>;
    });
}

function changeRecentDMCount(e: WheelEvent) {
    if (e.deltaY === 0 || !e.altKey) return;
    e.stopPropagation();
    e.preventDefault();
    const modifier = e.deltaY < 0 ? -1 : 1;
    const newValue = (settings.store.keepRecentDmsVisible ? settings.store.keepRecentDMCount : 0) + modifier;
    if (newValue > 0) settings.store.keepRecentDMCount = newValue;
    settings.store.keepRecentDmsVisible = newValue > 0;
}

const PrivateChannelSortStore = findStoreLazy("PrivateChannelSortStore");

const typingCache = {};

export default definePlugin({
    name: "KeepDMsInSidebar",
    description: "Pin direct messages to the guild sidebar",
    authors: [Devs.Sqaaakoi],
    settings,
    patches: [
        {
            find: "getUnreadPrivateChannelIds()),",
            replacement: {
                match: /\(0,\i\.\i\)\(\[\i\.\i\],\(\)=>\i\.\i\.getUnreadPrivateChannelIds\(\)\)/,
                replace: "$self.useSidebarPrivateChannelIds($&)"
            }
        },
        {
            find: "#{intl::DISCODO_DISABLED}",
            replacement: {
                match: /(?=onClick:\(\)=>{.{0,300}"discodo")/,
                replace: "onContextMenu:$self.openSettingsContextMenu,onWheel:$self.changeRecentDMCount,"
            }
        }
    ],
    contextMenus: {
        "user-context": contextMenuPatch,
        "gdm-context": contextMenuPatch,
    },
    openSettingsContextMenu,
    changeRecentDMCount,
    flux: {
        TYPING_START({ channelId }: { channelId: string; }) {
            if (ChannelStore.getChannel(channelId)?.isPrivate())
                typingCache[channelId] = Date.now();
        },
        TYPING_START_LOCAL({ channelId }: { channelId: string; }) {
            if (ChannelStore.getChannel(channelId)?.isPrivate())
                typingCache[channelId] = Date.now();
        }
    },
    useSidebarPrivateChannelIds(unreadChannelIds: string[]) {
        const { channelIDList, unreadDMsPosition, keepForSeconds, keepRecentDMCount, keepRecentDmsVisible, onlineMembersOnly, showRecentBots } = settings.use(["channelIDList", "unreadDMsPosition", "keepForSeconds", "keepRecentDMCount", "keepRecentDmsVisible", "onlineMembersOnly", "showRecentBots"]);
        const filterToOnlineOnly = (id: string) => {
            if (!onlineMembersOnly) return true;
            const channel = ChannelStore.getChannel(id);
            if (!channel) return true;
            if (!channel?.recipients) return true;
            return channel?.recipients?.some(rId => {
                const status = PresenceStore.getStatus(rId) ?? "offline";
                return status !== "offline";
            });
        };
        const pinnedList = channelIDList.split(",").map(id => id.trim()).filter(id => id.length > 0).filter(filterToOnlineOnly);
        const update = useForceUpdater();
        const recentChannels: string[] = useStateFromStores([PrivateChannelSortStore, ChannelStore, RelationshipStore, PresenceStore], () => PrivateChannelSortStore.getPrivateChannelIds().filter(id => {
            if (showRecentBots) return true;
            const channel = ChannelStore.getChannel(id);
            if (!channel) return true;
            if (!channel?.recipients) return true;
            return !channel?.recipients?.every(rId => {
                return UserStore.getUser(rId).bot;
            });
        }).filter(filterToOnlineOnly));
        const staticRecentChannels = recentChannels.filter(id => !pinnedList.includes(id)).slice(0, keepRecentDmsVisible ? keepRecentDMCount : 0);
        const dynamicRecentChannels = recentChannels.filter(id => {
            const message = (MessageStore as unknown as { getLastMessage: (channelId: string) => Message; }).getLastMessage(id);
            if (!message) return false;
            const age = Date.now() - Math.max(message.timestamp as unknown as number, typingCache[id]);
            const output = age < keepForSeconds * 1000;
            if (!output) setTimeout(() => update(), (age - (keepForSeconds * 1000)) * -1);
            return output;
        });

        const list = [pinnedList, ...new Set([staticRecentChannels, keepForSeconds > 0 ? dynamicRecentChannels : [], unreadChannelIds].flat().filter(id => !pinnedList.includes(id)))];

        if (unreadDMsPosition === UnreadDMsPosition.Above) list.reverse();
        return list.flat();
    }
});
