/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./WindowButtons.css";

import { classes } from "@utils/misc";
import { findByPropsLazy } from "@webpack";

import { cl } from "./TitleBar";
import TitleBarButton from "./TitleBarButton";

export const clwb = (name: string) => classes(cl("window-button"), cl(`window-button-${name}`));

export const sp = e => { e.preventDefault(); e.stopPropagation(); };

const PlatformMatchers = findByPropsLazy("isPlatformEmbedded");
const stockWindowActions = findByPropsLazy("minimize", "maximize", "close");

export const windowActions = {
    minimize(windowKey) {
        if (PlatformMatchers.isPlatformEmbedded) return stockWindowActions.minimize(windowKey);
        if (IS_VESKTOP) return VesktopNative?.win?.minimize(windowKey);
        return false;
    },
    maximize(windowKey) {
        if (PlatformMatchers.isPlatformEmbedded) return stockWindowActions.maximize(windowKey);
        if (IS_VESKTOP) return VesktopNative?.win?.maximize(windowKey);
        return false;
    },
    close(windowKey) {
        if (PlatformMatchers.isPlatformEmbedded) return stockWindowActions.close(windowKey);
        if (IS_VESKTOP) return VesktopNative?.win?.close(windowKey);
        return false;
    },
    get canUseWindowButtons() {
        if (PlatformMatchers.isPlatformEmbedded) return true;
        if (IS_VESKTOP) return true;
        return false;
    }
};

export default function WindowButtons({ windowKey }: { windowKey?: string; }) {
    if (!windowActions.canUseWindowButtons) return null;
    return <>
        <TitleBarButton
            action={() => windowActions.minimize(windowKey)}
            className={clwb("minimize")}
            buttonProps={{
                onAuxClick: sp,
                onContextMenu: sp
            }}
        >
            <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5.3 9.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z" />
            </svg>
        </TitleBarButton>
        <TitleBarButton
            action={() => windowActions.maximize(windowKey)}
            className={clwb("maximize")}
            buttonProps={{
                onAuxClick: sp,
                onContextMenu: sp
            }}
        >
            <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5.3 14.7a1 1 0 0   0 1.4 0L12 9.42l5.3 5.3a1 1 0 0 0 1.4-1.42l-6-6a1 1 0 0 0-1.4 0l-6 6a1 1 0 0 0 0 1.42Z" />
            </svg>
        </TitleBarButton>
        <TitleBarButton
            action={() => windowActions.close(windowKey)}
            className={clwb("close")}
            buttonProps={{
                onAuxClick: sp,
                onContextMenu: sp
            }}
        >
            <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z" />
            </svg>
        </TitleBarButton>
    </>;
}
