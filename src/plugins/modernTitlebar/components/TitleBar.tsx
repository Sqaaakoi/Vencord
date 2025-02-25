/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./TitleBar.css";

import { classes } from "@utils/misc";
import { findStoreLazy } from "@webpack";
import { useStateFromStores } from "@webpack/common";

import TitleBarGroupLeft from "./TitleBarGroupLeft";
import TitleBarGroupRight from "./TitleBarGroupRight";

const UserStore = findStoreLazy("UserStore");

export const cl = (name: string) => `vc-modernTitlebar-${name}`;

export default function TitleBar(props: {
    focused: boolean;
    windowKey?: string;
    type: string;
    macOSFrame?: boolean;
    themeOverride?: any;
}) {
    const user = useStateFromStores([UserStore], () => UserStore.getCurrentUser(), []);

    if (props?.windowKey ? (IS_VESKTOP ? !window?.Vesktop?.Settings?.store?.customTitleBar : false) : false) return null;

    return <div className={cl("container")}>
        <div className={cl("titlebar")}>
            <TitleBarGroupLeft user={user} windowKey={props?.windowKey} />
            <div className={classes(cl("spacer"))} />
            <TitleBarGroupRight user={user} windowKey={props?.windowKey} />
        </div>
    </div>;
}
