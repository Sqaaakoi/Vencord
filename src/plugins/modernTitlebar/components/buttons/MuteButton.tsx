/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findByCodeLazy } from "@webpack";
import { useEffect, useState } from "@webpack/common";

import { cl } from "../TitleBar";
import TitleBarButton from "../TitleBarButton";

const LottieMuteIcon = findByCodeLazy('"hover_unmuted":"hover_muted"');

export default function MuteButton() {
    // Most of this was blatantly stolen from Discord's own button.
    const [state, setState] = useState(false);
    const selfMute = false;
    const suppress = false;
    const serverMute = false;
    const muted = selfMute || suppress || serverMute || state;

    const { Component, play, events } = LottieMuteIcon(muted ? "unmute" : "mute");
    useEffect(() => () => play(), [muted, play]);
    return <>
        <TitleBarButton
            action={() => setState(!state)}
            className={cl("mute")}
            buttonProps={{
                onMouseEnter: () => events.onMouseEnter(),
                onMouseLeave: () => events.onMouseLeave(),
                role: "switch",
                "aria-checked": muted,
            }}
        >
            <Component
                size="custom"
                color={muted ? "var(--status-danger)" : "currentColor"}
            />
        </TitleBarButton >
    </>;
}
