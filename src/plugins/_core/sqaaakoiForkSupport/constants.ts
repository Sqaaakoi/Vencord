/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";


export const SQAAAKOI_USER_ID = Devs.Sqaaakoi.id + "";

export const CURRENT_WELCOME_NOTICE_VERSION = 3;
export const WELCOME_NOTICE_VERSION_KEY = "SqaaakoiForkSupport_StartupMessageVersion";

export const LAST_UPDATED_AT = new Date("2024-07-28T14:28:07.117Z");

// friends or not
const F = (strings: TemplateStringsArray, ...args: any[]) => [true, String.raw(strings, ...args)] as [boolean, string];
const N = (strings: TemplateStringsArray, ...args: any[]) => [false, String.raw(strings, ...args)] as [boolean, string];

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
                    // @ts-ignore
                    out.push(substitutions[i]);
                }
            }
        }
        return out.join("").trim();
    };
}

export const WELCOME_HEADER = "## 👋 Welcome to Sqaaakoi's Vencord fork!";
export const WELCOME_BACK_HEADER = "## 👋 What's new in Sqaaakoi's Vencord fork";

export const WELCOME_MESSAGE = friendsOnlyFilter`
Many new plugins have been made and many existing plugins have been updated recently. Here's a showcase.

**NewPluginsManager** shows a popup when plugins are added.
The plugin is enabled by default, you can disable it if you find it annoying.
Make sure to click Continue to completely dismiss it, this is intentional design.

**AutoMute** now has options to automatically mute when someone who isn't a friend joins your voice channel.

Additionally, **AskMeToMute** has been added so your admin friends can server mute you and it will turn into a client-side mute.

For those people who often create servers, **ServerTemplatesList** inserts templates from all your servers into the server creation menu.

**ShakingText** allows you to make \$shaking\$ text.

Regarding plugins that haven't been added back, I either forgot about them, or didn't use them enough to bother fixing them.
Some of these will be remade soon:tm:
-# ~~no they won't~~, or will they?

That's all for now. I have a [list of planned plugins](https://github.com/users/Sqaaakoi/projects/3/views/1) that I'd recommend taking a look at!

If any of my plugins have an issue, please file an issue on [GitHub](https://github.com/Sqaaakoi/Vencord/issues)
${F`${"\n"}-# Thank you, friends! If you have feedback on these plugins, please DM me :)`}
`;
