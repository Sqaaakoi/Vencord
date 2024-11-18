/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";


export const SQAAAKOI_USER_ID = Devs.Sqaaakoi.id + "";

export const CURRENT_WELCOME_NOTICE_VERSION = 4;
export const WELCOME_NOTICE_VERSION_KEY = "SqaaakoiForkSupport_StartupMessageVersion";

export const LAST_UPDATED_AT = new Date("2024-07-28T14:28:07.117Z");

// friends or not
const F = (strings: TemplateStringsArray, ...args: any[]) => [true, String.raw(strings, ...args)] as [boolean, string];
const N = (strings: TemplateStringsArray, ...args: any[]) => [false, String.raw(strings, ...args)] as [boolean, string];

const LF = "\n";

// horrible
function friendsOnlyFilter(_template: TemplateStringsArray, ..._substitutions: (string | [boolean, string])[]): (isFriend: boolean) => string {
    const substitutions = [..._substitutions];
    const template = [..._template.raw];
    return isFriend => {
        const out: string[] = [];
        if (template[0] === "\n") template.shift();
        if (template[template.length - 1] === "\n") template.pop();
        for (let i = 0; i < template.length; i++) {
            out.push(template[i]);
            if (i < substitutions.length) {
                if (Array.isArray(substitutions[i])) {
                    if (isFriend === substitutions[i][0]) out.push(substitutions[i][1]);
                } else {
                    out.push(substitutions[i] as string);
                }
            }
        }
        return out.join("").trim();
    };
}

export const WELCOME_HEADER = "## 👋 Welcome to Sqaaakoi's Vencord fork!";
export const WELCOME_BACK_HEADER = "## 👋 What's new in Sqaaakoi's Vencord fork";

export const WELCOME_MESSAGE = friendsOnlyFilter`
It's been a few months since I updated this. Here's what I've been working on, and what's coming soon.

## Useful plugins
**JunkCleanup** allows you to remove a lot of the annoyances in Discord. Includes 20+ toggles for you to choose what should be removed.
**NewPluginsManager** automatically notifies you when new plugins and plugin settings are added. It is enabled by default.
**BetterQuickReact** extends the context menu reactions list to include all the reactions you need.

You might also want to try **AutomodIndicator**, **ProfileCommand**, and **PreSendModeration**.

## Coming soon
**VoiceChatTweaks** (name not final) which fixes issues with the voice channel UI and UX

If any of my plugins have an issue, please file an issue on [GitHub](https://github.com/Sqaaakoi/Vencord/issues)
${F`${LF}-# Thank you, friends! If you have feedback on these plugins, please DM me :)`}
`;
