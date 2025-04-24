/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";

export const SQAAAKOI_USER_ID = Devs.Sqaaakoi.id + "";

export const CURRENT_WELCOME_NOTICE_VERSION = 7;
export const WELCOME_NOTICE_VERSION_KEY = "SqaaakoiForkSupport_StartupMessageVersion";

export const LAST_UPDATED_AT = new Date("2025-04-24T06:33:20.197Z");

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
I've finally decided to fix some stuff. This project is still low priority for me.

## Fixes and changes
KeepDMsInSidebar now allows you alt+scroll on the Discord logo to adjust the number of recent DMs shown
Fixed patches for ForwardHere and SwitchProfileButton without other changes
SimplifiedProfileNotes now uses the NOTE_PRIVATE string (and the patches have been fixed)
"Temporary" fix for plugins using Discord's Clipboard module that got replaced has been added recently

## Fixes for these plugins are coming soon
WowMoment (dedicated shortcut?)
ShowHiddenThings (guild settings)
ThemeAttributes (streamer mode)
ModernTitlebar (visual refresh)
ChannelDeck (crashing due to lack of an icon, and a lot of functionality is missing)
JunkCleanup (guild voice channel glow effect in Visual Refresh)
BetterQuickReact (CSS) (Messy git branch)
ShowTimeoutDetails (missing icon causing crash)

## Coming soon
Online status on DM icons in the guilds sidebar (maybe a KeepDMsInSidebar feature?)

## Refactoring stuff
I am considering making a new branch, and applying all my future changes to that branch.
I will leave a notice here if I make a new branch so that you can migrate.

If there is an issue with any feature included in this project, please file an issue on [GitHub](https://github.com/Sqaaakoi/Vencord/issues)
${F`${LF}-# Want to know more about this announcement? You can DM me with any questions you have.`}
`;
