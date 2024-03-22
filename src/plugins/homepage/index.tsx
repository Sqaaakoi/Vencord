/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { findByProps, findByPropsLazy, findExportedComponentLazy, LazyComponentWebpack } from "@webpack";
import { React } from "@webpack/common";

import Homepage from "./components/Homepage";

const LinkButton: React.ComponentType<React.HTMLAttributes<HTMLButtonElement> & {
    selected: boolean,
    route?: string,
    icon: React.ComponentType<any>,
    text: string,
    locationState?: object,
}> = findExportedComponentLazy("LinkButton", "CloseButton");

const { getHomeLink } = findByPropsLazy("getHomeLink");
const { setHomeLink } = findByPropsLazy("setHomeLink");

const HomeIcon = LazyComponentWebpack(() => {
    const component = findByProps("HomeIcon").HomeIcon;
    return React.memo(component);
});

/** Path for our custom route, to navigate to it for testing you'd use `nav.transitionTo(path)` on console */
const path = "/channels/@home";

export default definePlugin({
    name: "Homepage",
    description: "A new modern overview page of all your Discord activity.",
    authors: [Devs.Sqaaakoi],

    patches: [
        // Inject button
        {
            find: "friends_tab_no_track",
            replacement: {
                match: /(children:\[)(\(0,\i\.jsx\)\(\i,\{selected:.{0,30}\i\.Routes\.FRIENDS)/,
                replace: "$1$self.homePageButton(),$2"
            }
        },
        // Register route
        {
            find: 'Routes.ACTIVITY_DETAILS(":applicationId")',
            replacement: {
                match: /\((0,.{0,10}\.jsx\)\(.{0,10}\.default,){path:.{0,10}\.Routes\.MESSAGE_REQUESTS,.{0,100}?\),/,
                replace: "$&($1$self.route),"
            }
        },
        {
            find: 'on("LAUNCH_APPLICATION"',
            replacement: {
                match: /path:\[.{0,500}Routes\.MESSAGE_REQUESTS,/,
                replace: "$&$self.path,"
            }
        },
        {
            find: "ME:\"/channels/@me\"",
            replacement: {
                match: /ME:"\/channels\/@me"/,
                replace: "$&,HOME:\"/channels/@home\"",
            }
        },
        // invalid route check
        {
            find: "isValidGuildId:function",
            replacement: {
                match: /(\i)===(\i)\.ME\|\|/,
                replace: "$&$1===\"@home\"||",
            }
        },
        {
            find: ".doGuildOnboardingForPostAuthInvite)(",
            replacement: {
                match: /(\i\.params\.guildId===)/,
                replace: "$1\"@home\"||$1",
            }
        },
        {
            find: "case\"guild-channels\":",
            replacement: {
                match: /"@me"===(\i\.guildId)/,
                replace: "($&||\"@home\"===$1)",
            }
        },
        // Show DM sidebar in the page
        {
            find: "return function(){return window.location.pathname.startsWith(",
            replacement: {
                match: /:null!=(\i)\?/,
                replace: ":!([null,\"@home\"].includes($1))?",
            }
        },
        // Default page
        {
            find: "get fallbackRoute",
            replacement: {
                match: /([fallbackRoute|defaultRoute]\(\){return \i\.Routes\.)ME/g,
                replace: "$1HOME",
            }
        },

    ],
    path: path,
    route: {
        path: path,
        render: Homepage,
        disableTrack: true
    },
    homePageButton() {
        return <LinkButton
            key="homepage"
            selected={getHomeLink() === path}
            route={path}
            onClick={() => setHomeLink(path)}
            icon={HomeIcon}
            text="Home"
            role="listitem"
            tabIndex={- 1}
        />;
    }
});
