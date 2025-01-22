/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getIntlMessage } from "@utils/discord";
import { DefaultExtractAndLoadChunksRegex, extractAndLoadChunksLazy, findModuleId, proxyLazyWebpack, wreq } from "@webpack";
import { ContextMenuApi, Icons, SettingsRouter, Tooltip } from "@webpack/common";
import { User } from "discord-types/general";

import { cl } from "../TitleBar";
import TitleBarButton from "../TitleBarButton";

const requireContextMenu = extractAndLoadChunksLazy(["handleOpenSettingsContextMenu"], new RegExp("handleOpenSettingsContextMenu.{0,100}?" + DefaultExtractAndLoadChunksRegex.source));
const SettingsCogContextMenu = proxyLazyWebpack(() => wreq(findModuleId('navId:"user-settings-cog",') as any).default);

export default function SettingsButton(props: { user: User; }) {
    return <Tooltip
        text={getIntlMessage("USER_SETTINGS")}
        position="bottom"
    >
        {tooltipProps => <TitleBarButton
            action={() => { SettingsRouter.open("My Account"); }}
            className={cl("user-settings")}
            buttonProps={{
                ...tooltipProps,
                onContextMenu(e) {
                    ContextMenuApi.openContextMenuLazy(e, async () => {
                        await requireContextMenu();
                        return () => <SettingsCogContextMenu
                            user={props.user}
                        />;
                    });
                }
            }}
            icon={Icons.SettingsIcon}
        />}
    </Tooltip>;
}
