/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getIntlMessage } from "@utils/discord";
import { findByCodeLazy, findStoreLazy } from "@webpack";
import { ChannelStore, ContextMenuApi, FluxDispatcher, Icons, Menu, NavigationRouter, React, RelationshipStore, UserStore } from "@webpack/common";

import { cl } from "../TitleBar";
import TitleBarButton from "../TitleBarButton";

// stolen from PinDMs
export const PrivateChannelSortStore = findStoreLazy("PrivateChannelSortStore") as { getPrivateChannelIds: () => string[]; };

export default function QuickSwitcherButton() {
    return <TitleBarButton
        action={() => FluxDispatcher.dispatch({
            type: "QUICKSWITCHER_SHOW",
            query: "",
            queryMode: null
        })}
        className={cl("quick-switcher")}
        icon={Icons.CompassIcon}
        buttonProps={{
            onContextMenu(e) {
                ContextMenuApi.openContextMenu(e, () => <ChannelPickerContextMenu />);
            }
        }}
    />;
}

const formatChannelName = findByCodeLazy("#{intl::GROUP_DM_ALONE}");

function ChannelPickerContextMenu() {
    const dmChannels = PrivateChannelSortStore.getPrivateChannelIds().map(ChannelStore.getChannel);
    return <Menu.Menu
        navId="vc-modernTitlebar-quick-switcher-menu"
        onClose={ContextMenuApi.closeContextMenu}
    >
        <Menu.MenuGroup
            label={getIntlMessage("DIRECT_MESSAGES")}
        >
            {dmChannels.slice(0, 5).map(channel => <Menu.MenuItem
                key={`channel-${channel.id}`}
                id={`channel-${channel.id}`}
                label={formatChannelName(channel, UserStore, RelationshipStore)}
                action={() => NavigationRouter.transitionToGuild(channel.getGuildId(), channel.id)}
            />)}
        </Menu.MenuGroup>
    </Menu.Menu>;
}
