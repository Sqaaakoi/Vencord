/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getIntlMessage } from "@utils/discord";
import { findByCodeLazy, findByPropsLazy, findStoreLazy } from "@webpack";
import { ChannelStore, Icons, Tooltip, useEffect, useStateFromStores } from "@webpack/common";

import { cl } from "../TitleBar";
import TitleBarButton from "../TitleBarButton";

const LottieMuteIcon = findByCodeLazy('"hover_unmuted":"hover_muted"');

const RTCConnectionStore = findStoreLazy("RTCConnectionStore");
const MediaEngineStore = findStoreLazy("MediaEngineStore");
const GameConsoleStore = findStoreLazy("GameConsoleStore");

// horrible find. could be replaced by copying the useStateFromStores wrapper
const useMuted = findByCodeLazy(/,impersonateStore:\i\.\i/);
const toggleMute = findByCodeLazy("toggleSelfMute({location:", "#{intl::SUPPRESSED}");

const classes = findByPropsLazy("strikethrough", "buildOverrideButton");

const getTooltipLabel = findByCodeLazy("#{intl::CONSOLE_CONNECTING_DISABLED}", "#{intl::MUTE_ALT}");

export default function MuteButton() {
    // Most of this was blatantly stolen from Discord's own button.

    const currentChannel = useStateFromStores([RTCConnectionStore, ChannelStore], () => {
        const channelId = RTCConnectionStore.getChannelId();
        return channelId != null ? ChannelStore.getChannel(channelId) : null;
    });

    const { mute: serverMute, selfMute, suppress } = useMuted(currentChannel);

    const speakingWhileMuted = useStateFromStores([MediaEngineStore], () => MediaEngineStore.getSpeakingWhileMuted());

    // I can't believe I am actually implementing this.
    const awaitingRemote = useStateFromStores([GameConsoleStore], () => GameConsoleStore.getAwaitingRemoteSessionInfo() != null);

    const muted = selfMute || suppress || serverMute;

    const { Component, play, events } = LottieMuteIcon(muted ? "unmute" : "mute");
    useEffect(() => () => play(), [muted, play]);
    return <Tooltip
        text={speakingWhileMuted ? getIntlMessage("ACCOUNT_SPEAKING_WHILE_MUTED") : getTooltipLabel(selfMute, serverMute, suppress, awaitingRemote, false)}
        position="bottom"
        color={speakingWhileMuted ? Tooltip.Colors.GREEN : undefined}
        forceOpen={speakingWhileMuted}
    >
        {tooltipProps => <TitleBarButton
            action={() => { toggleMute(serverMute, suppress); tooltipProps.onClick(); }}
            className={cl("mute")}
            buttonProps={{
                ...tooltipProps,
                onMouseEnter: () => { tooltipProps.onMouseEnter(); events.onMouseEnter(); },
                onMouseLeave: () => { tooltipProps.onMouseLeave(); events.onMouseLeave(); },
                role: "switch",
                "aria-checked": muted,
                disabled: awaitingRemote
            }}
        >
            {serverMute || suppress ?
                <Icons.MicrophoneDenyIcon
                    size="custom"
                    colorClass={classes.strikethrough}
                    color="currentColor"
                />
                :
                <Component
                    size="custom"
                    color={muted ? "var(--status-danger)" : "currentColor"}
                />
            }
        </TitleBarButton>}
    </Tooltip>;
}
