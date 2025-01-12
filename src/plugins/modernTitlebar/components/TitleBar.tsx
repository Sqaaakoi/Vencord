/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./TitleBar.css";

import { classes } from "@utils/misc";
import { findStoreLazy } from "@webpack";
import { useRef, useStateFromStores } from "@webpack/common";

import OverrideCSS from "./OverrideCSS";
import TitleBarGroupLeft from "./TitleBarGroupLeft";
import TitleBarGroupRight from "./TitleBarGroupRight";

const UserStore = findStoreLazy("UserStore");

export const cl = (name: string) => `vc-modernTitlebar-${name}`;

export default function TitleBar(props: {
    focused: boolean;
    windowKey: any;
    type: string;
    macOSFrame: boolean;
    themeOverride: any;
}) {
    const userId = useStateFromStores([UserStore], () => UserStore.getCurrentUser()?.id, []);
    const ref = useRef<HTMLDivElement>(null);

    return <div
        className={cl("container")}
        ref={ref}
    // onContextMenu={e => ContextMenuApi.openContextMenu(e, () => <BasicContextMenu />)}
    >
        <OverrideCSS className={cl("styles")} />
        <div className={cl("titlebar")}>
            <TitleBarGroupLeft userId={userId} />
            <div className={classes(cl("spacer"))} />
            <TitleBarGroupRight userId={userId} windowKey={props?.windowKey} />
        </div >
    </div>;
}
