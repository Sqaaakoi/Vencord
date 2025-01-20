/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./TitleBarGroupRight.css";

import { classes } from "@utils/misc";
import { User } from "discord-types/general";

import { settings } from "../settings";
import ActionButtons from "./ActionButtons";
import QuickSwitcherButton from "./buttons/QuickSwitcherButton";
import CallPill from "./CallPill";
import { cl } from "./TitleBar";
import WindowButtons from "./WindowButtons";

export default function TitleBarGroupRight({ user, windowKey }: { user: User | undefined; windowKey: any; }) {
    const { quickSwitcherButton, callPill, actionButtons } = settings.use(["quickSwitcherButton", "callPill", "actionButtons"]);
    return <div className={classes(cl("titlebar-group"), cl("titlebar-group-right"))}>
        {callPill && <CallPill user={user} />}
        {/* <AccountPanel /> */}
        {actionButtons && user && <ActionButtons user={user} />}
        {quickSwitcherButton && user && <QuickSwitcherButton />}
        <WindowButtons windowKey={windowKey} />
    </div>;
}
