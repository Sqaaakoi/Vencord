/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./HomeIcon.css";

import { findComponentByCodeLazy, findStoreLazy } from "@webpack";
import { NavigationRouter } from "@webpack/common";

import { cl } from "../TitleBar";
import TitleBarButton from "../TitleBarButton";

const ClydeIcon = findComponentByCodeLazy("M19.73 4.87a18.2 18.2 0 0 0-4.6-1.44");
const DefaultRouteStore = findStoreLazy("DefaultRouteStore");

export default function HomeIcon() {
    return <TitleBarButton
        action={() => NavigationRouter.transitionTo(DefaultRouteStore.defaultRoute)}
        className={cl("button-home")}
        buttonProps={{
            "data-branch": window?.GLOBAL_ENV?.RELEASE_CHANNEL
        }}
        icon={ClydeIcon}
    />;
}
