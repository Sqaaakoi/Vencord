/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./CallPill.css";

import { classes, getIntlMessage } from "@utils/index";
import { findByCodeLazy, findByPropsLazy, findComponentByCodeLazy, findStoreLazy } from "@webpack";
import { ChannelStore, ContextMenuApi, GuildStore, Menu, NavigationRouter, Popout, RelationshipStore, SelectedChannelStore, UserStore, useStateFromStores } from "@webpack/common";
import { Channel, User } from "discord-types/general";

import { useCallTimer } from "../utils/callTimer";
import Pill from "./Pill";
import { cl } from "./TitleBar";

const formatChannelName = findByCodeLazy("#{intl::GROUP_DM_ALONE}");
const VoiceChannelActions = findByPropsLazy("selectVoiceChannel", "disconnect");

const PhoneCallIcon = findComponentByCodeLazy("M13 7a1 1 0 0 1 1-1 4 4 0 0");

const SortedVoiceStateStore = findStoreLazy("SortedVoiceStateStore");
const ConnectedVoiceUsers = findComponentByCodeLazy(",isSelfOnOtherClient:", "getSessionId");

const popoutClasses = findByPropsLazy("root", "voiceUsers");

// Adapted from CallTimer
function formatDuration(ms: number) {
    const format = (n: number) => ("" + n).padStart(2, "0");

    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const m = Math.floor(((ms % 86400000) % 3600000) / 60000);
    const s = Math.floor((((ms % 86400000) % 3600000) % 60000) / 1000);

    const list = [h, m, s];
    if (d === 0 && h === 0) list.shift();

    return (d > 0 ? `${d}d ` : "") + list.map(format).join(":");
}

export default function CallPill(props: { user: User | undefined; }) {
    const time = useCallTimer();

    const channel = useStateFromStores([SelectedChannelStore], () => ChannelStore.getChannel(SelectedChannelStore.getVoiceChannelId()!));

    if (time === null || !props.user || !channel) return null;
    return <Popout
        renderPopout={({ closePopout }) => <CallPillPopout
            channel={channel}
            closePopout={closePopout}
        />}
        spacing={16}
        position="bottom"
        align="center"
    >
        {popoutProps => <Pill
            // action={() => {
            //     NavigationRouter.transitionToGuild(channel.getGuildId(), channel.id);
            // }}
            className={cl("call-pill")}
            pillProps={{
                ...popoutProps,
                onContextMenu(e) {
                    ContextMenuApi.openContextMenu(e, () => <CallPillContextMenu channel={channel} />);
                }
            }}
        >
            <PhoneCallIcon size="xs" color="currentColor" />
            <span className={classes(cl("pill-content"), cl("call-pill-content"))}>{formatDuration(time!)}</span>
        </Pill>}
    </Popout>;
}

export function CallPillPopout({ channel, closePopout }: { channel: Channel; closePopout(): void; }) {
    const voiceStates = useStateFromStores([SortedVoiceStateStore], () => SortedVoiceStateStore.getVoiceStatesForChannel(channel));
    return <div className={classes(cl("call-pill-popout"), popoutClasses.root)}>
        <ConnectedVoiceUsers
            className={popoutClasses.voiceUsers}
            allowDragging={false}
            allowPreviews={false}
            channel={channel}
            voiceStates={voiceStates}
            collapsed={false}
        />
    </div>;
}

export function CallPillContextMenu({ channel }: { channel: Channel; }) {
    const guild = GuildStore.getGuild(channel.getGuildId());
    return <Menu.Menu
        navId="vc-modernTitlebar-call-pill-menu"
        onClose={ContextMenuApi.closeContextMenu}
    >
        <Menu.MenuGroup label="Current Call">
            <Menu.MenuItem
                id="current-channel"
                label={formatChannelName(channel, UserStore, RelationshipStore)}
                subtext={guild?.name}
                action={() => NavigationRouter.transitionToGuild(channel.getGuildId(), channel.id)}
            />
        </Menu.MenuGroup>
        <Menu.MenuGroup>
            <Menu.MenuItem
                id="disconnect"
                color="danger"
                label={getIntlMessage("DISCONNECT_SELF")}
                action={() => {
                    VoiceChannelActions.disconnect();
                }}
            />
        </Menu.MenuGroup>
    </Menu.Menu>;
}
