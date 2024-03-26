/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./WelcomeBackHeader.css";

import { findByPropsLazy } from "@webpack";
import { Button, i18n, NavigationRouter, UserStore, useStateFromStores } from "@webpack/common";

import { cl } from "./common";
import { OnlineFriendsCount } from "./OnlineFriendsCount";

const { Routes } = findByPropsLazy("Routes");
const DisplayProfile = findByPropsLazy("getDisplayProfile");

export function greeting(name: string) {
    const date = new Date();
    const time = (date.getHours() * 60) + date.getMinutes();
    if (time < 4 * 60 || time >= 22 * 60) return `Good night, ${name}`;
    if (time < 8 * 60) return `Good morning, ${name}`;
    if (time < 14 * 60) return `Welcome back, ${name}`;
    if (time < 17 * 60) return `Good afternoon, ${name}`;
    if (time < 22 * 60) return `Good evening, ${name}`;
}

export default function WelcomeBackHeader(props: {}) {
    const user = useStateFromStores([UserStore], () => UserStore.getCurrentUser(), null, (old, current) => old?.id === current?.id);
    // const profile = useStateFromStores([UserProfileStore, UserStore], () => DisplayProfile.getDisplayProfile(UserStore.getCurrentUser()?.id), null, (old, current) => old?.userId === current?.userId);
    if (!user) return null;
    return <div
        className={cl("header")}
    // style={{
    //     backgroundImage: //profile.getBannerURL({ size: 2048, canAnimate: true })
    // }}
    >
        <div className={cl("header-body")}>
            <img
                className={cl("avatar")}
                src={user.getAvatarURL(undefined, 256)}
            />
            <div className={cl("header-text")}>
                <h1 className={cl("header-greeting")}>{greeting((user as unknown as { globalName: string; }).globalName)}</h1>
                <OnlineFriendsCount />
            </div>
            <div className={cl("header-buttons")}>
                <Button
                    color={Button.Colors.PRIMARY}
                    onClick={() => NavigationRouter.transitionTo(Routes.ME)}
                >
                    {i18n.Messages.DIRECT_MESSAGES}
                </Button>
            </div>
        </div>
    </div>;
}
