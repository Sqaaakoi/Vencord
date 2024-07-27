/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { definePluginSettings } from "@api/Settings";
import { makeRange } from "@components/PluginSettings/components";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { findByCodeLazy } from "@webpack";

const settings = definePluginSettings({
    multiplier: {
        description: "Volume Multiplier",
        type: OptionType.SLIDER,
        markers: makeRange(1, 5, 1),
        default: 2,
        stickToMarkers: true,
    }
});
// for some godforsaken reason, the volume is ran through this formula before its stored. pathcing it out does not work.
export const VolumeEncoder = {
    decode: findByCodeLazy("6+1:"),
    encode: findByCodeLazy("50+50"),
}
export default definePlugin({
    name: "VolumeBooster",
    authors: [Devs.Nuckyz, Devs.sadan],
    description: "Allows you to set the user and stream volume above the default maximum.",
    settings,

    patches: [
        // Change the max volume for sliders to allow for values above 200
        ...[
            ".Messages.USER_VOLUME",
            "currentVolume:"
        ].map(find => ({
            find,
            replacement: {
                match: /(?<=maxValue:\i\.\i)\?(\d+?):(\d+?)(?=,)/,
                replace: (_, higherMaxVolume, minorMaxVolume) => ""
                      + `?${higherMaxVolume}*$self.settings.store.multiplier`
                      + `:${minorMaxVolume}*$self.settings.store.multiplier`
            }
        })),
        //PATCHES NEEDED FOR WEB/VESKTOP
        {
            find: "streamSourceNode",
            predicate: () => IS_WEB || IS_VESKTOP,
            group: true,
            replacement: [
                // to pervent the cap of 100
                {
                match: /Math.max.*?\)\)/,
                replace: "Math.round(arguments[0])"
                },
                // to update the volume on user join
                {
                    match: /,this.stream.getTracks\(\).length/,
                    replace: ",this.updateAudioElement()$&"
                },
                // to actually patch the volume
                {
                    match: /volume=t.*?;/,
                    replace: "volume=0.00;$self.patchVolume.call(this);"
                }
            ]
        },
        // Prevent Audio Context Settings sync from trying to sync with values above 200, changing them to 200 before we send to Discord
        {
            find: "AudioContextSettingsMigrated",
            replacement: [
                {
                    match: /(?<=isLocalMute\(\i,\i\),volume:.+?volume:)\i(?=})/,
                    replace: "$&>200?200:$&"
                },
                {
                    match: /(?<=Object\.entries\(\i\.localMutes\).+?volume:).+?(?=,)/,
                    replace: "$&>200?200:$&"
                },
                {
                    match: /(?<=Object\.entries\(\i\.localVolumes\).+?volume:).+?(?=})/,
                    replace: "$&>200?200:$&"
                }
            ]
        },
        // Prevent the MediaEngineStore from overwriting our LocalVolumes above 200 with the ones the Discord Audio Context Settings sync sends
        {
            find: '="MediaEngineStore",',
            replacement: [
                {
                    match: /(\.settings\.audioContextSettings.+?)(\i\[\i\])=(\i\.volume)(.+?setLocalVolume\(\i,).+?\)/,
                    replace: (_, rest1, localVolume, syncVolume, rest2) => rest1
                        + `(${localVolume}>200?void 0:${localVolume}=${syncVolume})`
                        + rest2
                        + `${localVolume}??${syncVolume})`
                }
            ]
        }
    ],
    patchVolume(){
        if(!this.streamSourceNode)
            this.streamSourceNode = this.audioContext.createMediaStreamSource(this.stream);
        //only create one per stream
        if(this.gainNode) {
            this.gainNode.gain.value = VolumeEncoder.decode(this._volume)/100;
            return;
        }
        const source = this.streamSourceNode as MediaStreamAudioSourceNode;
        const gn = (this.audioContext as AudioContext).createGain();
        this.gainNode = gn;
        source.connect(gn);
        gn.connect(this.audioContext.destination);
    }
});
