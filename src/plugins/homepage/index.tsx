/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin from "@utils/types";
import { findByPropsLazy, findExportedComponentLazy } from "@webpack";

import Homepage from "./components/Homepage";


const logger = new Logger("CustomRoutesExample", "#f765bb");
logger.log("Starting");

const nav: {
    /** Transition to a route */
    transitionTo: (path: string) => unknown,
    getHistory: () => {
        location: {
            /** The current route */
            pathname: string;
        };
    },
} = findByPropsLazy("transitionTo", "transitionToGuild", "getHistory");

const LinkButton: React.ComponentType<React.HTMLAttributes<HTMLButtonElement> & {
    selected: boolean,
    route?: string,
    icon: React.ComponentType<any>,
    text: string,
    locationState?: object,
}> = findExportedComponentLazy("LinkButton", "CloseButton");

const homeLinkModule = findByPropsLazy("setHomeLink");

const HomeIcon = findByPropsLazy("HomeIcon");

/** Path for our custom route, to navigate to it for testing you'd use `nav.transitionTo(path)` on console */
const path = "/channels/@home";

function onBeforeUnload(event: BeforeUnloadEvent) {
    // Necessary to prevent Discord from trying to fetch the route (which would take to a 404)
    if (nav.getHistory().location.pathname === path) {
        event.preventDefault();
        nav.transitionTo("/channels/@me");
        logger.log("Patched reload!");
        setTimeout(() => window.location.reload(), 0);
    }
}


export default definePlugin({
    name: "Homepage",
    description: "A new modern overview page of all your Discord activity.",
    authors: [Devs.Sqaaakoi],

    /*
        Both of these patches below are necessary for the custom route to work.
        The first patch defines the route and component to render when transitioning to it
        I think the second patch has to do with how the route's page is rendered, like threads can be split view with channels or something alike
    */
    patches: [
        {
            find: "friends_tab_no_track",
            replacement: {
                match: /("nav",\{.{0,30}\.privateChannels,.{0,100}children:)(\[.{0,5000}\}\)\])/,
                replace: "$1$self.patchChildren($2)"
            }
        },
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
        // {
        //     find: "props.privateChannelIds.indexOf",
        //     replacement: {
        //         match: /(innerAriaLabel:)(\i\.default\.Messages\.DIRECT_MESSAGES)/,
        //         replace: "$1(()=>{debugger;return $2})()",
        //     }
        // },
        {
            find: "get fallbackRoute",
            replacement: {
                match: /([fallbackRoute|defaultRoute]\(\){return \i\.Routes\.)HOME/g,
                replace: "$1ME",
            }
        },

    ],
    path: path,
    route: {
        path: path,
        render: Homepage,
        disableTrack: true
    },
    patchChildren(children: any[]) {
        logger.log("Got children!", children);
        const c = [...children];
        const { homeLink } = c[1].props;
        c[1]?.props?.children?.push(
            <LinkButton
                key="homepage"
                selected={homeLink === path}
                route={path}
                onClick={() => homeLinkModule.setHomeLink(path)}
                icon={HomeIcon}
                text="Home"
                role="listitem"
                tabIndex={- 1}
            />
        );
        return c;
    }
});
