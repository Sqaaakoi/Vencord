/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
    homeButton: {
        type: OptionType.BOOLEAN,
        description: "Show a home button",
        default: true
    },
    sidebarButton: {
        type: OptionType.BOOLEAN,
        description: "Show a toggle sidebar button",
        default: true
    },
    serverCount: {
        type: OptionType.BOOLEAN,
        description: "Show the number of servers you are in",
        default: false
    },
    onlineFriendCount: {
        type: OptionType.BOOLEAN,
        description: "Show the number of servers you are in",
        default: false
    },
    mentionsBadge: {
        type: OptionType.BOOLEAN,
        description: "Show a mention counter",
        default: true
    },
    callPill: {
        type: OptionType.BOOLEAN,
        description: "Show a current call timer pill",
        default: true
    },
    actionButtons: {
        type: OptionType.BOOLEAN,
        description: "Show the mute/deafen buttons",
        default: true
    },
    quickSwitcherButton: {
        type: OptionType.BOOLEAN,
        description: "Show a quick switcher button",
        default: true
    },
});
