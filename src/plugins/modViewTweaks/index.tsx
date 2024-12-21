/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { SelectedChannelStore, UserProfileActions } from "@webpack/common";
import { User } from "discord-types/general";

export default definePlugin({
    name: "ModViewTweaks",
    description: "Practical improvements to Mod View",
    authors: [Devs.Sqaaakoi],
    patches: [
        // Profile popout
        {
            find: "bottomRowActionDisabled]:",
            replacement: [
                {
                    match: /(memberNameContainer,.{0,30})"div"(.{0,30}memberAvatar,)/,
                    replace: "$1Vencord.Webpack.Common.Popout$2style:{cursor:'pointer'},onClick:()=>$self.openUserProfile(arguments[0]),"
                },
            ]
        }
    ],

    openUserProfile({ user, guildId }: { user: User, guildId: string; }) {
        UserProfileActions.openUserProfileModal({
            userId: user.id,
            guildId,
            channelId: SelectedChannelStore.getChannelId(),
            analyticsLocation: {
                page: guildId ? "Guild Channel" : "DM Channel",
                section: "Profile Popout"
            }
        });
    }
});
