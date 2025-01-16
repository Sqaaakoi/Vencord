/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Popout } from "@webpack/common";
import { User } from "discord-types/general";

import { cl } from "../TitleBar";
import TitleBarButton from "../TitleBarButton";

export default function ProfileButton(props: { user: User | undefined; }) {
    return <Popout
        renderPopout={popoutProps => <div>

        </div>}
    >
        {popoutProps => <TitleBarButton
            action={() => { }}
            className={cl("deafen")}
            buttonProps={{
                ...popoutProps
            }}
        >

        </TitleBarButton>}
    </Popout>;
}
