/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./CallPill.css";

import { classes, getIntlMessage } from "@utils/index";
import { findByPropsLazy } from "@webpack";
import { ChannelStore, ContextMenuApi, Icons, Menu, NavigationRouter, SelectedChannelStore } from "@webpack/common";

import { useCallTimer } from "../utils/callTimer";
import Pill from "./Pill";
import { cl } from "./TitleBar";

const VoiceChannelActions = findByPropsLazy("selectVoiceChannel", "disconnect");

function formatDuration(ms: number) {
    // here be dragons (moment fucking sucks)
    const human = false;

    const format = (n: number) => human ? n : n.toString().padStart(2, "0");
    const unit = (s: string) => human ? s : "";
    const delim = human ? " " : ":";

    // thx copilot
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const m = Math.floor(((ms % 86400000) % 3600000) / 60000);
    const s = Math.floor((((ms % 86400000) % 3600000) % 60000) / 1000);

    let res = "";
    if (d) res += `${d}d `;
    if (h || res) res += `${format(h)}${unit("h")}${delim}`;
    if (m || res || !human) res += `${format(m)}${unit("m")}${delim}`;
    res += `${format(s)}${unit("s")}`;

    return res;
}

export default function CallPill(props: { userId: string; }) {
    const time = useCallTimer();

    if (time === null || !props.userId) return null;
    return <Pill
        action={() => {
            const channelId = SelectedChannelStore.getVoiceChannelId();
            if (!channelId) return;
            const channel = ChannelStore.getChannel(channelId);
            NavigationRouter.transitionToGuild(channel.getGuildId(), channelId);
        }}
        className={cl("call-pill")}
        pillProps={{
            onContextMenu(e) {
                ContextMenuApi.openContextMenu(e, () => <CallPillContextMenu />);
            }
        }}
    >
        <Icons.PhoneCallIcon size="xs" color="currentColor" />
        <span className={classes(cl("pill-content"), cl("call-pill-content"))}>{formatDuration(time!)}</span>
    </Pill>;
}

export function CallPillContextMenu() {
    return <Menu.Menu
        navId="vc-modernTitlebar-call-pill-menu"
        onClose={ContextMenuApi.closeContextMenu}
    >
        <Menu.MenuItem
            id="disconnect"
            color="danger"
            label={getIntlMessage("DISCONNECT_SELF")}
            action={() => {
                VoiceChannelActions.disconnect();
            }}
        />
    </Menu.Menu>;
}
