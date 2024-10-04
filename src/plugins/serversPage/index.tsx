/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { findByCodeLazy, findByPropsLazy, findComponentByCodeLazy } from "@webpack";

import ServersPage from "./components/ServersPage";

export const setHomeLink = findByCodeLazy('dispatch({type:"APP_VIEW_SET_HOME_LINK",');

const LinkButton: React.ComponentType<React.HTMLAttributes<HTMLButtonElement> & {
    selected: boolean,
    route?: string,
    icon: React.ComponentType<any>,
    text: string;
}> = findComponentByCodeLazy(".linkButtonIcon,");

export const { ServerIcon } = findByPropsLazy("ServerIcon");

const generateListItemProps = findByCodeLazy('role:"listitem",[');

export const route = "/guilds/@me";

export default definePlugin({
    name: "ServersPage",
    description: "Adds a page for servers, also adds hiding servers",
    authors: [Devs.Sqaaakoi],

    patches: [
        // Inject button
        {
            find: ".PRIVATE_CHANNELS_A11Y_LABEL",
            replacement: {
                match: /(children:\[\(0,\i\.jsx\)\(\i,\{selected:(.{0,20}?===)\i\.\i\.FRIENDS(.{0,20}?===)\i\.\i\.FRIENDS.{0,1200}?"\))\]/,
                replace: "$1,$self.injectButton($2$self.route$3$self.route)]"
            }
        },
        // Rendering route
        {
            find: "ImpressionNames.ACTIVITY_DETAILS,",
            replacement: {
                match: /(\(0,\i\.jsx\)\(\i\.\i,){path:\i\.\i\.MESSAGE_REQUESTS,.{0,100}?\}\),/,
                replace: "$1{path:$self.route,render:$self.createServersPage,disableTrack:!0}),"
            }
        },
        // Route validity
        {
            find: 'on("LAUNCH_APPLICATION"',
            replacement: {
                match: /path:\[.{0,500}\i\.MESSAGE_REQUESTS,/,
                replace: "$&$self.route,"
            }
        },
        // Keyboard shortcut
        {
            find: "hasLibraryApplication()&&",
            replacement: {
                match: /(return\[.{0,300}?)(\]\.filter\()/,
                replace: "$1,$self.route$2"
            }
        }
    ],

    route,
    injectButton(selected) {
        return <LinkButton
            key="servers"
            selected={selected}
            route={this.route}
            onClick={() => setHomeLink(this.route)}
            icon={ServerIcon}
            text="Servers"
            {...generateListItemProps("servers")}
        />;
    },
    createServersPage: () => <ServersPage />,
    ServersPage
});
