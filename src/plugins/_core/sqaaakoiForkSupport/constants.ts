/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";

export const SQAAAKOI_USER_ID = Devs.Sqaaakoi.id + "";

export const CURRENT_WELCOME_NOTICE_VERSION = 5;
export const WELCOME_NOTICE_VERSION_KEY = "SqaaakoiForkSupport_StartupMessageVersion";

export const LAST_UPDATED_AT = new Date("2025-01-15T07:33:16.451Z");

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
Happy (late) new year!

Despite ChannelTabs being too much of a nightmare to implement cleanly, the custom titlebar is coming back!

**ModernTitlebar** implements a highly configurable titlebar with various useful buttons and indicators.
It can replace the following plugins and do much more
- CallTimer (adds a pill to the right side of the titlebar with basic information about your current call)
- ServerListIndicators (adds these statistics to the left side of the titlebar)
I intend to move the account panel in the bottom left corner of the app to be inside of this titlebar very soon.

## Coming ~~soon~~ eventually
**VoiceChatTweaks** (name not final) will add the ability to automatically start watching streams

If any of my plugins have an issue, please file an issue on [GitHub](https://github.com/Sqaaakoi/Vencord/issues)
${F`${LF}-# Thank you, friends! If you have feedback on these plugins, please DM me :)`}
`;
