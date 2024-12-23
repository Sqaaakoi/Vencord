/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

export default definePlugin({
    name: "ForwardHere",
    description: "Adds the current channel at the top of the Forward menu",
    authors: [Devs.Sqaaakoi],
    settings: definePluginSettings({
        selectedByDefault: {
            type: OptionType.BOOLEAN,
            description: "Selects the current channel in the forward menu by default",
            default: false
        }
    }),
    patches: [
        {
            find: 'location:"ForwardModal"',
            replacement: [
                // top of search results
                {
                    match: /(selectedDestinations:)(\i)(,originDestination:)(\i)/,
                    replace: "$1[$4,...$2]$3$4"
                },
                // select by default
                {
                    match: /(\[\i,\i]=\i\.useState\()(\i)(\).{0,120}originDestination:)(\i)/,
                    replace: "$1$2.length<1&&$self.settings.store.selectedByDefault?[$4]:$2$3$4"
                }
            ]
        }
    ]
});
