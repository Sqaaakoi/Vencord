/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Icons } from "@webpack/common";

import { toggleSidebar } from "../../utils/sidebar";
import { cl } from "../TitleBar";
import TitleBarButton from "../TitleBarButton";

export default function SidebarButton() {
    return <TitleBarButton
        action={() => toggleSidebar()}
        className={cl("button-sidebar")}
        icon={Icons.MenuIcon}
    />;
}
