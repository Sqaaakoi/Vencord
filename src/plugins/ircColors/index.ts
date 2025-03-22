/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { definePluginSettings } from "@api/Settings";
import { hash as h64 } from "@intrnl/xxhash64";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { ThemeStore, useMemo, useStateFromStores } from "@webpack/common";

// Calculate a CSS color string based on the user ID
function calculateNameColorForUser(id?: string) {
    const { lightness, lightnessLightMode, hashSeed } = settings.use(["lightness", "lightnessLightMode", "hashSeed"]);
    const theme = useStateFromStores([ThemeStore], () => ThemeStore.theme === "light");
    const idHash = useMemo(() => id ? h64(id, hashSeed as bigint) : null, [id, hashSeed]);
    return idHash && `hsl(${idHash % 360n}, 100%, ${theme ? lightnessLightMode : lightness}%)`;
}

const settings = definePluginSettings({
    lightness: {
        description: "Lightness, in %. Change if the colors are too light or too dark",
        type: OptionType.NUMBER,
        default: 70,
    },
    lightnessLightMode: {
        description: "Lightness, in %. Change if the colors are too light or too dark",
        type: OptionType.NUMBER,
        default: 30,
    },
    memberListColors: {
        description: "Replace role colors in the member list",
        restartNeeded: true,
        type: OptionType.BOOLEAN,
        default: true
    },
    applyColorOnlyToUsersWithoutColor: {
        description: "Apply colors only to users who don't have a predefined color",
        type: OptionType.BOOLEAN,
        default: false
    },
    applyColorInDms: {
        description: "Apply colors in direct messages",
        type: OptionType.BOOLEAN,
        default: true
    },
    applyColorInServers: {
        description: "Apply colors in servers",
        type: OptionType.BOOLEAN,
        default: true
    },
    hashSeed: {
        description: "Seed for hash function",
        restartNeeded: false,
        type: OptionType.BIGINT,
        default: 0n
    },
});

export default definePlugin({
    name: "IrcColors",
    description: "Makes username colors in chat unique, like in IRC clients",
    authors: [Devs.Grzesiek11, Devs.jamesbt365],
    settings,

    patches: [
        {
            find: '="SYSTEM_TAG"',
            replacement: {
                match: /(?<=className:\i\.username,style:.{0,50}:void 0,)/,
                replace: "style:{color:$self.calculateNameColorForMessageContext(arguments[0])},"
            }
        },
        {
            find: "#{intl::GUILD_OWNER}),children:",
            replacement: {
                match: /(typingIndicatorRef:.+?},)(\i=.+?)color:null!=.{0,50}?(?=,)/,
                replace: (_, rest1, rest2) => `${rest1}ircColor=$self.calculateNameColorForListContext(arguments[0]),${rest2}color:ircColor`
            },
            predicate: () => settings.store.memberListColors
        }
    ],

    calculateNameColorForMessageContext(context: any) {
        const userId: string | undefined = context?.message?.author?.id;
        const colorString = context?.author?.colorString;
        const color = calculateNameColorForUser(userId);
        const { applyColorInDms, applyColorInServers, applyColorOnlyToUsersWithoutColor } = settings.use(["applyColorInDms", "applyColorInServers", "applyColorOnlyToUsersWithoutColor"]);

        // Color preview in role settings
        if (context?.message?.channel_id === "1337" && userId === "313337")
            return colorString;

        if (!(context?.channel?.isPrivate() ? applyColorInDms : applyColorInServers)) {
            return colorString;
        }

        return (!applyColorOnlyToUsersWithoutColor || !colorString)
            ? color
            : colorString;
    },
    calculateNameColorForListContext(context: any) {
        const id = context?.user?.id;
        const colorString = context?.colorString;
        const color = calculateNameColorForUser(id);
        const { applyColorInDms, applyColorInServers, applyColorOnlyToUsersWithoutColor } = settings.use(["applyColorInDms", "applyColorInServers", "applyColorOnlyToUsersWithoutColor"]);

        if (!(context?.channel?.isPrivate() ? applyColorInDms : applyColorInServers)) {
            return colorString;
        }

        return (!applyColorOnlyToUsersWithoutColor || !colorString)
            ? color
            : colorString;
    }
});
