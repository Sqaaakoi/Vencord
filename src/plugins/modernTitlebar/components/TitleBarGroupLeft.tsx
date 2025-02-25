/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./TitleBarGroupLeft.css";

import { classes } from "@utils/misc";
import { User } from "discord-types/general";

import { settings } from "../settings";
import HomeIcon from "./buttons/HomeIcon";
import SidebarButton from "./buttons/SidebarButton";
import StatCounters from "./StatCounters";
import { cl } from "./TitleBar";
import TotalMentionsBadge from "./TotalMentionsBadge";

export default function TitleBarGroupLeft({ user, windowKey }: { user: User | undefined; windowKey?: string; }) {
    const { homeButton, sidebarButton, mentionsBadge } = settings.use(["homeButton", "sidebarButton", "mentionsBadge"]);
    return <div className={classes(cl("titlebar-group"), cl("titlebar-group-left"))}>
        {homeButton && <HomeIcon windowKey={windowKey} />}
        {sidebarButton && !windowKey && <SidebarButton />}
        {user && <StatCounters />}
        {mentionsBadge && user && <TotalMentionsBadge />}
    </div>;
}
