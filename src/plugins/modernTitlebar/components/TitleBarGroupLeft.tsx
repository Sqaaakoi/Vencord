/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./TitleBarGroupLeft.css";

import { classes } from "@utils/misc";
import { findByPropsLazy, findStoreLazy } from "@webpack";
import { NavigationRouter } from "@webpack/common";

import SidebarButton from "./SidebarButton";
import StatCounters from "./StatCounters";
import { cl } from "./TitleBar";
import TitleBarButton from "./TitleBarButton";

const { ClydeIcon } = findByPropsLazy("ClydeIcon");
const DefaultRouteStore = findStoreLazy("DefaultRouteStore");

export default function TitleBarGroupLeft({ userId }: { userId: string; }) {
    return <div className={classes(cl("titlebar-group"), cl("titlebar-group-left"))}>
        <TitleBarButton
            action={() => NavigationRouter.transitionTo(DefaultRouteStore.defaultRoute)}
            className={cl("button-home")}
            icon={ClydeIcon}
        />
        <SidebarButton />
        {/* {userId && <TotalMentionsBadge />} */}
        {userId && <StatCounters />}
    </div >;
}
