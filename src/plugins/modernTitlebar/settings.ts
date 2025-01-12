/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";

export const settings = definePluginSettings({
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
});
