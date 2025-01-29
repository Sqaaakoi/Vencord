/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findComponentByCodeLazy } from "@webpack";

import { toggleSidebar } from "../../utils/sidebar";
import { cl } from "../TitleBar";
import TitleBarButton from "../TitleBarButton";

const MenuIcon = findComponentByCodeLazy("M2 18a1 1 0 1 0 0 2h20a1 1 0 1 0 0-2H2Z");

export default function SidebarButton() {
    return <TitleBarButton
        action={() => toggleSidebar()}
        className={cl("button-sidebar")}
        icon={MenuIcon}
    />;
}
