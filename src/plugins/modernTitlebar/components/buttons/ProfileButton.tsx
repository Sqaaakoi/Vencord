/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./ProfileButton.css";

import { Avatar, Popout, Text, UsernameUtils } from "@webpack/common";
import { User } from "discord-types/general";

import { cl } from "../TitleBar";
import TitleBarButton from "../TitleBarButton";

export default function ProfileButton({ user }: { user: User; }) {
    const name = UsernameUtils.useName(user);

    return <Popout
        renderPopout={popoutProps => <div>

        </div>}
    >
        {popoutProps => <TitleBarButton
            action={() => { }}
            className={cl("profile")}
            buttonProps={{
                ...popoutProps
            }}
        >
            <Text variant="text-sm/medium" className={cl("profile-name")}>{name}</Text>
            <Avatar
                size="SIZE_24"
                src={user.getAvatarURL(undefined, 128)}
            />
        </TitleBarButton>}
    </Popout>;
}
