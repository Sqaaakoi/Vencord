/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findStoreLazy } from "@webpack";
import { FluxDispatcher, Icons } from "@webpack/common";
import { FluxEvents } from "@webpack/types";

import { cl } from "./TitleBar";
import TitleBarButton from "./TitleBarButton";

const MobileWebSidebarStore = findStoreLazy("MobileWebSidebarStore");

export default function SidebarButton() {
    return <TitleBarButton
        action={() => FluxDispatcher.dispatch({
            type: "MOBILE_WEB_SIDEBAR_" + (MobileWebSidebarStore.getIsOpen() ? "CLOSE" : "OPEN") as FluxEvents,
            force: true
        })}
        className={cl("button-sidebar")}
        icon={Icons.MenuIcon}
    />;
}
