/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./TitleBarGroupLeft.css";

import { classes } from "@utils/misc";
import { findByPropsLazy, findStoreLazy } from "@webpack";
import { NavigationRouter } from "@webpack/common";
import { User } from "discord-types/general";

import { settings } from "../settings";
import SidebarButton from "./buttons/SidebarButton";
import StatCounters from "./StatCounters";
import { cl } from "./TitleBar";
import TitleBarButton from "./TitleBarButton";
import TotalMentionsBadge from "./TotalMentionsBadge";

const { ClydeIcon } = findByPropsLazy("ClydeIcon");
const DefaultRouteStore = findStoreLazy("DefaultRouteStore");

export default function TitleBarGroupLeft({ user }: { user: User | undefined; }) {
    const { homeButton, sidebarButton, mentionsBadge } = settings.use(["homeButton", "sidebarButton", "mentionsBadge"]);
    return <div className={classes(cl("titlebar-group"), cl("titlebar-group-left"))}>
        {homeButton && <TitleBarButton
            action={() => NavigationRouter.transitionTo(DefaultRouteStore.defaultRoute)}
            className={cl("button-home")}
            icon={ClydeIcon}
        />}
        {sidebarButton && <SidebarButton />}
        {user && <StatCounters />}
        {mentionsBadge && user && <TotalMentionsBadge />}
    </div>;
}
