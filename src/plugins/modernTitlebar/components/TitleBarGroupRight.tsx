/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./TitleBarGroupRight.css";

import { classes } from "@utils/misc";
import { FluxDispatcher, Icons } from "@webpack/common";

import { settings } from "../settings";
import ActionButtons from "./ActionButtons";
import CallPill from "./CallPill";
import { cl } from "./TitleBar";
import TitleBarButton from "./TitleBarButton";
import WindowButtons from "./WindowButtons";

export default function TitleBarGroupRight({ userId, windowKey }: { userId: string; windowKey: any; }) {
    const { quickSwitcherButton, callPill } = settings.use(["quickSwitcherButton", "callPill"]);
    return <div className={classes(cl("titlebar-group"), cl("titlebar-group-right"))}>
        {callPill && <CallPill userId={userId} />}
        {/* <AccountPanel /> */}
        {userId && <ActionButtons />}
        {quickSwitcherButton && userId && <TitleBarButton
            action={() => FluxDispatcher.dispatch({
                type: "QUICKSWITCHER_SHOW",
                query: "",
                queryMode: null
            })}
            className={cl("quick-switcher")}
            icon={Icons.CompassIcon}
        />}
        <WindowButtons windowKey={windowKey} />
    </div>;
}
