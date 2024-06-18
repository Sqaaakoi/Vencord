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
import { ChannelStore, Menu, MessageStore, PrivateChannelsStore, useStateFromStores } from "@webpack/common";
import { Message, User } from "discord-types/general";

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
        default: 15
    },
    keepRecentDMCount: {
        description: "Number of recent DMs to always keep in the sidebar",
        type: OptionType.NUMBER,
        default: 0
    }
});

const contextMenuPatch: NavContextMenuPatchCallback = (children, props) => {
    const { channelIDList } = settings.use(["channelIDList"]);
    if (!props) return;
    const { user }: { user: User; } = props;
    const group = findGroupChildrenByChildId("mute-channel", children);
    const cachedChannelId = ChannelStore.getDMFromUserId(user.id);
    const enabled = !!cachedChannelId && channelIDList.split(",").map(id => id.trim()).includes(cachedChannelId);
    if (group)
        group.push(
            <Menu.MenuCheckboxItem
                label="Pin to Sidebar"
                id="toggle-pinned-to-sidebar"
                key="toggle-pinned-to-sidebar"
                checked={enabled}
                action={async () => {
                    const channelId = await PrivateChannelsStore.getOrEnsurePrivateChannel(user.id);
                    const old = channelIDList.split(",").map(id => id.trim()).filter(id => id.length > 0);
                    settings.store.channelIDList = (enabled ? old.filter(id => id !== channelId) : [...old, channelId]).join(",");
                }}
            />
        );
};

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
                match: /\(0,\i.useStateFromStoresArray\)\(\[\i\.default\],\(\)=>\i\.default\.getUnreadPrivateChannelIds\(\)\)/,
                replace: "$self.useSidebarPrivateChannelIds($&)"
            }
        }
    ],
    contextMenus: {
        "user-context": contextMenuPatch,
    },
    flux: {
        TYPING_START({ channelId }: { channelId: string; }) {
            typingCache[channelId] = Date.now();
        },
        TYPING_START_LOCAL({ channelId }: { channelId: string; }) {
            typingCache[channelId] = Date.now();
        }
    },
    useSidebarPrivateChannelIds(unreadChannelIds: string[]) {
        const { channelIDList, unreadDMsPosition, keepForSeconds, keepRecentDMCount } = settings.use(["channelIDList", "unreadDMsPosition", "keepForSeconds", "keepRecentDMCount"]);
        const pinnedList = channelIDList.split(",").map(id => id.trim()).filter(id => id.length > 0);
        const update = useForceUpdater();
        const recentChannels: string[] = useStateFromStores([PrivateChannelSortStore], () => PrivateChannelSortStore.getPrivateChannelIds());
        const staticRecentChannels = recentChannels.filter(id => !pinnedList.includes(id)).slice(0, keepRecentDMCount);
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
