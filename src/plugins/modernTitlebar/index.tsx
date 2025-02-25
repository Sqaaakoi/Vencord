/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

import TitleBar from "./components/TitleBar";
import { settings } from "./settings";
import { startCallTimerSubscription, stopCallTimerSubscription } from "./utils/callTimer";
import { adjustContextMenu } from "./utils/contextMenu";
import { disableStyles, enableStyles, injectOverrides } from "./utils/overrideCSS";
import { keybindHandler } from "./utils/sidebar";

export default definePlugin({
    name: "ModernTitlebar",
    description: "Adds a thicker, more modern looking titlebar to Discord, without the Visual Refresh",
    authors: [Devs.Sqaaakoi],
    tags: ["CustomTitlebar"],
    settings,
    patches: [
        {
            find: ".wordmarkWindows,",
            replacement: {
                match: /switch\(\i\)\{/,
                replace: "return $self.renderTitleBar(arguments[0]);switch(0){"
            }
        },
        // {
        //     find: 'setProperty("--custom-app-panels-height"',
        //     replacement: {
        //         match: /,\(0,\i\.jsx\).{0,30}?ACCOUNT_PANEL,.{0,30}?{}\)}\)/,
        //         replace: ""
        //     }
        // }
        {
            find: '"MobileWebSidebarStore"',
            replacement: {
                match: /let (\i)=!1;(.{0,50}return)(!\i\.\i)\|\|\1(.{0,300}?MOBILE_WEB_SIDEBAR_OPEN:function\()\)\{(.{0,30}?MOBILE_WEB_SIDEBAR_CLOSE:function\()\)\{/,
                replace: "let $1=$3;$2 $1$4fluxEvent){if($3&&!fluxEvent?.force)return;$5fluxEvent){if($3&&!fluxEvent?.force)return;"
            }
        },
        // Make the Guilds bar not be removed from the DOM entirely, to prevent an ugly animation when reopening the sidebar
        {
            find: 'case"pendingFriends":',
            replacement: {
                match: /(?<=container,children:\[)(\i)&&(.{0,40}?className:\i\.guilds,)/,
                replace: "$2hidden:!$1,"
            }
        },
        // Accept the hidden property from above
        {
            find: "unreadMentionsIndicatorTop,barClassName",
            replacement: {
                match: /\[\i\.hidden\]:\i/,
                replace: "$&||arguments[0]?.hidden"
            }
        },
        // Stop context menus from going off screen
        {
            find: 'if("pageX"in',
            replacement: {
                match: /=(\i\.pageY)/,
                replace: "=$self.adjustContextMenu($1)"
            }
        }
    ],
    renderTitleBar(props) {
        return <ErrorBoundary noop>
            <TitleBar {...props} />
        </ErrorBoundary>;
    },
    adjustContextMenu,

    start() {
        enableStyles();
        injectOverrides();
        startCallTimerSubscription();
        document.addEventListener("keydown", keybindHandler);
    },
    stop() {
        disableStyles();
        stopCallTimerSubscription();
        document.removeEventListener("keydown", keybindHandler);
    }
});
