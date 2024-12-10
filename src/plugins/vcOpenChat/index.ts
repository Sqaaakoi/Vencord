/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "VoiceChatOpenChat",
    description: "Open voice channel chat pages instead of joining the channel",
    authors: [Devs.Sqaaakoi],
    patches: [
        {
            find: "VoiceChannel.renderPopout: There must always be something to render",
            all: true,
            replacement: [
                // {
                //     match: /"handleClickChat",/,
                //     replace: ""
                // }
                {
                    match: /\.ChatIcon,/,
                    replace: ".PhoneCallIcon,"
                },
                {
                    match: /#{intl::OPEN_CHAT}/g,
                    replace: '[Vencord.Util.runtimeHashMessageKey("ACTIVITY_FEED_NOW_PLAYING_ACTION_JOIN_CHANNEL")]'
                },

                {
                    match: /(this,"handleClick",)(.{0,150}?)(\),\i\(this.{0,1200}Clickable.{0,100}?onClick:)(.{0,100}?)(,"aria-label")/,
                    replace: "$1$4$3$2$5"
                }
            ]
        }
    ]
});
