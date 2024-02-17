/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addSettingsListener, definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin, { OptionType, PluginNative } from "@utils/types";

const logger = new Logger("VoiceStatusSocket");

const enum ChannelTypes {
    DM = 1,
    GROUP_DM = 3
}

interface Call {
    channel_id: string,
    guild_id: string,
    message_id: string,
    region: string,
    ringing: string[];
}

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

const settings = definePluginSettings({
    muteAndDeafen: {
        type: OptionType.BOOLEAN,
        description: "Allow apps to mute and deafen you",
        default: true
    },
    disconnect: {
        type: OptionType.BOOLEAN,
        description: "Allow apps to disconnect you from voice channels",
        default: true
    },
});

const Native = VencordNative.pluginHelpers.VoiceStatusSocket as PluginNative<typeof import("./native")>;

function broadcast(data: any) {
    let dataStr: string;
    if (typeof data === "string") {
        dataStr = data;
    }
    dataStr = JSON.stringify(data);
    logger.log("Broadcast", data);
    return Native.broadcast(dataStr);
}

// function getAvatarDataURI(userID: string, guildID: string | undefined): string {
//     const url = new URL(Common.UserStore.getUser(userID).getAvatarURL(guildID, 128));
//     const pathname = url.pathname.split("/");
//     const filename = pathname[pathname.length - 1].split(".");
//     filename[filename.length - 1] = "png";
//     pathname[pathname.length - 1] = filename.join(".");
//     url.pathname = pathname.join("/");
//     fetch(url).then(response => response.arrayBuffer());
// }


export default definePlugin({
    name: "VoiceStatusSocket",
    description: "View and control your voice channel over a local socket",
    authors: [Devs.Sqaaakoi],
    settings,
    flux: {
        SPEAKING(s: SpeakingState) {
            broadcast({
                command: "speaking",
                user: s.userId,
                speaking: s.speakingFlags & SpeakingFlagsMask.VOICE,
                soundshare: s.speakingFlags & SpeakingFlagsMask.SOUNDSHARE,
                priority: s.speakingFlags & SpeakingFlagsMask.PRIORITY
            });
        },
        AUDIO_TOGGLE_SELF_MUTE() {
            callCommand("isSelfMute");
        },
        AUDIO_TOGGLE_SELF_DEAF() {
            callCommand("isSelfDeaf");
        }
    },
    start() {
        Native.init();
    },
    stop() {
        Native.stop();
    },
    callCommand
});

addSettingsListener("plugins.VoiceStatusSocket.writeState", async v => {
    broadcast({
        command: "permission",
        write: v
    });
});

export function callCommand(command: string, remote?: boolean) {
    if (remote) logger.log("Command", command);
    let name = "";
    let args = { command: name };
    try {
        args = JSON.parse(command);
        if ("command" in args) {
            name = args.command;
        }
    } catch (e) {
        name = command;
    }
    if (name in commands) {
        const response = commands[name](name, args);
        if (response !== undefined) broadcast(response);
    }
}

export const commands = {
    broadcastState() {
        callCommand("canMuteAndDeafen");
        callCommand("canDisconnect");
        callCommand("isSelfMute");
        callCommand("isSelfDeaf");
    },
    canMuteAndDeafen(n) {
        return {
            command: n,
            value: Vencord.Settings.plugins.VoiceStatusSocket.muteAndDeafen
        };
    },
    canDisconnect(n) {
        return {
            command: n,
            value: Vencord.Settings.plugins.VoiceStatusSocket.disconnect
        };
    },
    getClientUser() {
        return {
            command: "clientUser",
        };
    },
    isSelfMute(n) {
        return {
            command: n,
            value: Vencord.Webpack.findByProps("isSelfMute").isSelfMute()
        };
    },
    isSelfDeaf(n) {
        return {
            command: n,
            value: Vencord.Webpack.findByProps("isSelfDeaf").isSelfDeaf()
        };
    },
    selfMute(n, a) {

    }
};
