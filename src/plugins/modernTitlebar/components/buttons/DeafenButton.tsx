/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { DefaultExtractAndLoadChunksRegex, extractAndLoadChunksLazy, findByCodeLazy, findByPropsLazy, findComponentByCodeLazy, findStoreLazy } from "@webpack";
import { ChannelStore, ContextMenuApi, Tooltip, useEffect, useStateFromStores } from "@webpack/common";

import { cl } from "../TitleBar";
import TitleBarButton from "../TitleBarButton";

const LottieDeafenIcon = findByCodeLazy('"hover_undeafened":"hover_deafened"');

const RTCConnectionStore = findStoreLazy("RTCConnectionStore");
const GameConsoleStore = findStoreLazy("GameConsoleStore");

const useDeafened = findByCodeLazy("return{selfDeaf:");
const toggleDeafen = findByCodeLazy("toggleSelfDeaf({location:", "#{intl::SERVER_DEAFENED_DIALOG_TITLE}");

const classes = findByPropsLazy("strikethrough", "buildOverrideButton");

const getTooltipLabel = findByCodeLazy("#{intl::SERVER_DEAFENED_DIALOG_TITLE}", "#{intl::DEAFEN}");

const requireContextMenu = extractAndLoadChunksLazy(["handleInputAudioContextMenu"], new RegExp(DefaultExtractAndLoadChunksRegex.source + ".{0,100}?renderOutputDevices"));
const AudioDeviceContextMenu = findByCodeLazy('navId:"audio-device-context",');

const HeadphonesDenyIcon = findComponentByCodeLazy("M12.38 1c.38.02.58.45.4.78-.15.3-.3.62-.4.95A.4.4 0 0 1 12 3");

export default function DeafenButton() {
    // Most of this was blatantly stolen from Discord's own button.

    const currentChannel = useStateFromStores([RTCConnectionStore, ChannelStore], () => {
        const channelId = RTCConnectionStore.getChannelId();
        return channelId != null ? ChannelStore.getChannel(channelId) : null;
    });

    const { deaf: serverDeaf, selfDeaf } = useDeafened(currentChannel);

    // I can't believe I am actually implementing this.
    const awaitingRemote = useStateFromStores([GameConsoleStore], () => GameConsoleStore.getAwaitingRemoteSessionInfo() != null);

    const deafened = selfDeaf || serverDeaf;

    const { Component, play, events } = LottieDeafenIcon(deafened ? "undeafen" : "deafen");
    useEffect(() => () => play(), [deafened, play]);
    return <Tooltip
        text={getTooltipLabel(selfDeaf, serverDeaf, false)}
        position="bottom"
    >
        {tooltipProps => <TitleBarButton
            action={() => { toggleDeafen(serverDeaf); tooltipProps.onClick(); }}
            className={cl("deafen")}
            buttonProps={{
                ...tooltipProps,
                onMouseEnter: () => { tooltipProps.onMouseEnter(); events.onMouseEnter(); },
                onMouseLeave: () => { tooltipProps.onMouseLeave(); events.onMouseLeave(); },
                role: "switch",
                "aria-checked": deafened,
                disabled: awaitingRemote,
                onContextMenu(e) {
                    ContextMenuApi.openContextMenuLazy(e, async () => {
                        await requireContextMenu();
                        return () => <AudioDeviceContextMenu
                            onClose={ContextMenuApi.closeContextMenu}
                            renderOutputDevices
                            renderOutputVolume
                        />;
                    });
                }
            }}
        >
            {serverDeaf ?
                <HeadphonesDenyIcon
                    size="custom"
                    colorClass={classes.strikethrough}
                    color="currentColor"
                />
                :
                <Component
                    size="custom"
                    color={deafened ? "var(--status-danger)" : "currentColor"}
                />
            }
        </TitleBarButton>}
    </Tooltip>;
}
