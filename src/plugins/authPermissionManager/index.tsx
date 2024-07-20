/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { findByProps } from "@webpack";

import * as constants from "./constants";

const settings = definePluginSettings({
    disableDangerousPermissions: {
        type: OptionType.BOOLEAN,
        description: "Dangerous permissions will be turned off by default. It is recommended to leave this setting enabled.",
        default: true
    }
});


export default definePlugin({
    name: "AuthPermissionManager",
    description: "Uncheck permissions within the app authorization menu",
    authors: [Devs.Sqaaakoi],
    settings,

    patches: [
        // {
        //     find: "",
        //     replacement: {
        //         match: /./,
        //         replace: ""
        //     }
        // }
    ],






    defaults: constants,
    get allPermissions() {
        return Object.values(findByProps("OPENID", "IDENTIFY")); // Useful for debugging
    },
});
