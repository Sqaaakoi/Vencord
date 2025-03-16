/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";

export const SQAAAKOI_USER_ID = Devs.Sqaaakoi.id + "";

export const CURRENT_WELCOME_NOTICE_VERSION = 6;
export const WELCOME_NOTICE_VERSION_KEY = "SqaaakoiForkSupport_StartupMessageVersion";

export const LAST_UPDATED_AT = new Date("2025-03-16T00:00:43.162Z");

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
This project is distancing itself from upstream Vencord.

## Why?
To put it simply, Discord Drama™ and Certified Discord Moderation™

## What's changing
The project is now much lower priority for me. I won't be updating it as often.
New features will still be added, just not as often as in the past.
Fixes and merging in upstream changes will still happen on a regular basis, and whenever something important breaks.

If there is an issue with any feature included in this project, please file an issue on [GitHub](https://github.com/Sqaaakoi/Vencord/issues)
${F`${LF}-# Want to know more about this announcement? You can DM me with any questions you have.`}
`;
