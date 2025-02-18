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
import ProfileButton from "./buttons/ProfileButton";
import QuickSwitcherButton from "./buttons/QuickSwitcherButton";
import SettingsButton from "./buttons/SettingsButton";
import CallPill from "./CallPill";
import { cl } from "./TitleBar";
import WindowButtons from "./WindowButtons";

export default function TitleBarGroupRight({ user, windowKey }: { user: User | undefined; windowKey: any; }) {
    const { quickSwitcherButton, callPill, profileButton, actionButtons, settingsButton } = settings.use(["quickSwitcherButton", "callPill", "profileButton", "actionButtons", "settingsButton"]);
    return <div className={classes(cl("titlebar-group"), cl("titlebar-group-right"))}>
        {callPill && <CallPill user={user} />}
        {/* <AccountPanel /> */}
        {profileButton && user && <ProfileButton user={user} />}
        {actionButtons && user && <ActionButtons user={user} />}
        {settingsButton && user && !windowKey && <SettingsButton user={user} />}
        {quickSwitcherButton && user && !windowKey && <QuickSwitcherButton />}
        <WindowButtons windowKey={windowKey} />
    </div>;
}
