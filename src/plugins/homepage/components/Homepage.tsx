/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./Homepage.css";

import { findByPropsLazy } from "@webpack";
import { ScrollerThin } from "@webpack/common";

import { cl } from "./common";
import Feed from "./Feed";
import WelcomeBackHeader from "./WelcomeBackHeader";

const ProfileListClasses = findByPropsLazy("emptyIconFriends", "emptyIconGuilds");

export default function Homepage(props?: any) {
    return <div className={cl("root")}>
        <ScrollerThin
            className={ProfileListClasses.listScroller}
            fade={true}
        >
            <WelcomeBackHeader />
            <div className={cl("body")}>
                <Feed />
            </div>
        </ScrollerThin >
    </div >;
}
