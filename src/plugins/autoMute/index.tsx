/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { definePluginSettings } from "@api/Settings";
import { makeRange } from "@components/PluginSettings/components";
import { clearableDebounce, debounce } from "@shared/debounce";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy, findStoreLazy } from "@webpack";
import { Menu, SelectedChannelStore, Toasts, UserStore } from "@webpack/common";
import { User } from "discord-types/general";

const { toggleSelfMute } = findByPropsLazy("toggleSelfMute");

// We cannot destructure isSelfMute as it depends on isEnabled
const MediaEngineStore = findStoreLazy("MediaEngineStore");


interface SpeakingState {
    speakingFlags: number,
    type: string,
    userId: string;
}

const enum SpeakingFlagsMask {
    VOICE = 1 << 0,
    SOUNDSHARE = 1 << 1,
    PRIORITY = 1 << 2
}

interface VoiceState {
    guildId?: string;
    channelId?: string;
    oldChannelId?: string;
    user: User;
    userId: string;
}

let [setAutoMute, cancelAutoMute] = [() => { }, () => { }];

function updateTimeout(seconds: number) {
    cancelAutoMute();
    [setAutoMute, cancelAutoMute] = clearableDebounce(autoMute, seconds * 1000);
    updateAutoMute();
}

const settings = definePluginSettings({
    isEnabled: {
        type: OptionType.BOOLEAN,
        description: "Whether the plugin will automatically mute you or not",
        default: true,
        onChange() {
            updateAutoMute();
        }
    },
    timeout: {
        description: "Inactivity timeout (seconds)",
        type: OptionType.SLIDER,
        markers: [15, ...makeRange(60, 900, 60)],
        default: 300,
        stickToMarkers: false,
        onChange(value) {
            updateTimeout(value);
        },
    }
});


const AudioDeviceContextMenuPatch: NavContextMenuPatchCallback = (children, props: { renderInputVolume?: boolean; }) => {
    const { isEnabled, timeout } = settings.use(["isEnabled", "timeout"]);

    if ("renderInputVolume" in props) {
        children.splice(children.length - 1, 0,
            <Menu.MenuGroup
                label="Auto Mute"
            >
                <Menu.MenuCheckboxItem
                    checked={isEnabled}
                    id="vc-auto-mute-toggle"
                    label="Enable Auto Mute"
                    action={() => {
                        settings.store.isEnabled = !isEnabled;
                        updateAutoMute();
                    }}
                />
                <Menu.MenuControlItem
                    id="vc-auto-mute-timeout"
                    label="Inactivity Timeout"
                    control={(props, ref) => (
                        <Menu.MenuSliderControl
                            {...props}
                            ref={ref}
                            minValue={15}
                            maxValue={900}
                            value={timeout}
                            onChange={debounce((rawValue: number) => {
                                const value = Math.round(rawValue);
                                settings.store.timeout = value;
                                updateTimeout(value);
                            }, 10)}
                            renderValue={(value: number) => {
                                const minutes = Math.floor(value / 60);
                                const seconds = Math.round(value % 60);
                                return [
                                    minutes,
                                    `${seconds < 10 ? "0" + seconds : seconds}${minutes ? "" : "s"}`
                                ].filter(Boolean).join(":");
                            }}
                        />
                    )}
                />
            </Menu.MenuGroup>
        );
    }
};


let isSpeaking = false;

function updateAutoMute() {
    if (!settings.store.isEnabled) return cancelAutoMute();
    if (!SelectedChannelStore.getVoiceChannelId()) return cancelAutoMute();
    isSpeaking ? cancelAutoMute() : setAutoMute();
}

function autoMute() {
    if (!MediaEngineStore.isSelfMute()) {
        toggleSelfMute();
        Toasts.show({
            message: "You have been silent for a while, so your mic has been automatically muted.",
            type: Toasts.Type.MESSAGE,
            id: Toasts.genId(),
            options: {
                duration: 5000,
                position: Toasts.Position.TOP
            }
        });
    }
}

// Blatantly stolen from VcNarrator plugin

// For every user, channelId and oldChannelId will differ when moving channel.
// Only for the local user, channelId and oldChannelId will be the same when moving channel,
// for some ungodly reason
let clientOldChannelId: string | undefined;

export default definePlugin({
    name: "AutoMute",
    description: "Automatically mute yourself in voice channels if you're not speaking for too long.",
    authors: [Devs.Sqaaakoi],
    settings,
    flux: {
        SPEAKING(s: SpeakingState) {
            if (s.userId !== UserStore.getCurrentUser().id) return;
            isSpeaking = (s.speakingFlags & SpeakingFlagsMask.VOICE) === 1;
            isSpeaking ? cancelAutoMute() : setAutoMute();
        },
        VOICE_STATE_UPDATES({ voiceStates }: { voiceStates: VoiceState[]; }) {
            // Blatantly stolen from my other unfinished plugin
            if (!voiceStates) return;
            voiceStates.forEach(state => {
                if (state.userId !== UserStore.getCurrentUser().id) return;
                const { channelId } = state;
                let { oldChannelId } = state;
                if (channelId !== clientOldChannelId) {
                    oldChannelId = clientOldChannelId;
                    clientOldChannelId = channelId;
                }

                if (!oldChannelId && channelId) {
                    updateAutoMute();
                }
                if (oldChannelId && !channelId) {
                    cancelAutoMute();
                    isSpeaking = false;
                }
            });
        },
        AUDIO_TOGGLE_SELF_MUTE() {
            updateAutoMute();
        },
        AUDIO_TOGGLE_SELF_DEAF() {
            updateAutoMute();
        },
        AUDIO_TOGGLE_SET_MUTE() {
            updateAutoMute();
        },
        AUDIO_TOGGLE_SET_DEAF() {
            updateAutoMute();
        },
    },
    contextMenus: {
        "audio-device-context": AudioDeviceContextMenuPatch
    },
    start() {
        updateTimeout(settings.store.timeout);
    },
    stop() {
        cancelAutoMute();
    }
});

