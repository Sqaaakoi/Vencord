/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { getIntlMessage } from "@utils/discord";
import { findByCodeLazy, findComponentByCodeLazy, findStoreLazy } from "@webpack";
import { ChannelStore, ContextMenuApi, FluxDispatcher, Menu, NavigationRouter, React, RelationshipStore, UserStore } from "@webpack/common";

import { cl } from "../TitleBar";
import TitleBarButton from "../TitleBarButton";

// stolen from PinDMs
export const PrivateChannelSortStore = findStoreLazy("PrivateChannelSortStore") as { getPrivateChannelIds: () => string[]; };

const CompassIcon = findComponentByCodeLazy("M23 12a11 11 0 1 1-22 0 11 11 0 0 1 22 0ZM7.74 9.3A2 2 0 0 1 9.3 7.75l7.22-1.45");

export default function QuickSwitcherButton() {
    return <TitleBarButton
        action={() => FluxDispatcher.dispatch({
            type: "QUICKSWITCHER_SHOW",
            query: "",
            queryMode: null
        })}
        className={cl("quick-switcher")}
        icon={CompassIcon}
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
