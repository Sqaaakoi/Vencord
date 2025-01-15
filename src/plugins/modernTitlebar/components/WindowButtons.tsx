/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./WindowButtons.css";

import { classes } from "@utils/misc";
import { findByPropsLazy } from "@webpack";
import { Icons } from "@webpack/common";

import { cl } from "./TitleBar";
import TitleBarButton from "./TitleBarButton";

export const clwb = (name: string) => classes(cl("window-button"), cl(`window-button-${name}`));

export const sp = e => { e.preventDefault(); e.stopPropagation(); };

const PlatformMatchers = findByPropsLazy("isPlatformEmbedded");
const stockWindowActions = findByPropsLazy("minimize", "maximize", "close");

export const windowActions = {
    minimize(windowKey) {
        if (PlatformMatchers.isPlatformEmbedded) return stockWindowActions.minimize(windowKey);
        if (IS_VESKTOP) return VesktopNative?.win?.minimize();
        return false;
    },
    maximize(windowKey) {
        if (PlatformMatchers.isPlatformEmbedded) return stockWindowActions.maximize(windowKey);
        if (IS_VESKTOP) return VesktopNative?.win?.maximize();
        return false;
    },
    close(windowKey) {
        if (PlatformMatchers.isPlatformEmbedded) return stockWindowActions.close(windowKey);
        if (IS_VESKTOP) return VesktopNative?.win?.close();
        return false;
    },
    get canUseWindowButtons() {
        if (PlatformMatchers.isPlatformEmbedded) return true;
        if (IS_VESKTOP) return true;
        return false;
    }
};

export default function WindowButtons({ windowKey }: { windowKey: any; }) {
    if (!windowActions.canUseWindowButtons) return null;
    return <>
        <TitleBarButton
            action={() => windowActions.minimize(windowKey)}
            className={clwb("minimize")}
            icon={Icons.ChevronSmallDownIcon}
            buttonProps={{
                onAuxClick: sp,
                onContextMenu: sp
            }}
        />
        <TitleBarButton
            action={() => windowActions.maximize(windowKey)}
            className={clwb("maximize")}
            icon={Icons.ChevronSmallUpIcon}
            buttonProps={{
                onAuxClick: sp,
                onContextMenu: sp
            }}
        />
        <TitleBarButton
            action={() => windowActions.close(windowKey)}
            className={clwb("close")}
            icon={Icons.XSmallIcon}
            buttonProps={{
                onAuxClick: sp,
                onContextMenu: sp
            }}
        />
    </ >;
}
