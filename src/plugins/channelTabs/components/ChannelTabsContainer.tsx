/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2023 Vendicated and contributors
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

import { classes } from "@utils/misc";
import { useForceUpdater } from "@utils/react";
import { findByPropsLazy, findComponentByCodeLazy } from "@webpack";
import { Button, ContextMenuApi, Flex, FluxDispatcher, Forms, NavigationRouter, React, SelectedChannelStore, SelectedGuildStore, useCallback, useEffect, useRef, UserStore, useState, useStateFromStores } from "@webpack/common";

import { ChannelTabsProps, channelTabsSettings as settings, ChannelTabsUtils } from "../util";
import BookmarkContainer from "./BookmarkContainer";
import ChannelTab, { PreviewTab } from "./ChannelTab";
import { BasicContextMenu, TabContextMenu } from "./ContextMenus";
import WindowButtons from "./WindowButtons";

const {
    closeTab, createTab, handleChannelSwitch, isTabSelected,
    moveToTab, saveTabs, openStartupTabs, setUpdaterFunction
} = ChannelTabsUtils;

const { PlusSmallIcon } = findByPropsLazy("PlusSmallIcon");
const { ClydeIcon } = findByPropsLazy("ClydeIcon");
const { CompassIcon } = findByPropsLazy("CompassIcon");
const XIcon = findComponentByCodeLazy("M18.4 4L12 10.4L5.6 4L4 5.6L10.4");
const MentionsBadge = findComponentByCodeLazy("mentionsBadge");

export const cl = (name: string) => `vc-channeltabs-${name}`;
export const clab = (name: string) => classes(cl("button"), cl("action-button"), cl(`${name}-button`), cl("hoverable"));

export default function ChannelsTabsContainer() {
    const props = useStateFromStores([SelectedChannelStore, SelectedGuildStore], () => {
        return {
            channelId: SelectedChannelStore.getChannelId(),
            guildId: SelectedGuildStore.getGuildId() || "@me"
        };
    });
    const { openTabs } = ChannelTabsUtils;
    const [userId, setUserId] = useState("");
    const { showBookmarkBar, showHomeButton, showQuickSwitcher } = settings.use(["showBookmarkBar", "showHomeButton", "showQuickSwitcher"]);

    const mentionCount = React.useSyncExternalStore(ChannelTabsUtils.mentionCountSubscribe, () => ChannelTabsUtils.mentionCountData);

    const _update = useForceUpdater();
    const update = useCallback((save = true) => {
        _update();
        if (save) saveTabs(userId);
    }, [userId]);

    useEffect(() => {
        // for some reason, the app directory is it's own page instead of a layer, so when it's opened
        // everything behind it is destroyed, including our container. this workaround is required
        // to properly add the container back without reinitializing everything
        if ((Vencord.Plugins.plugins.ChannelTabs as any).appDirectoryClosed) {
            setUserId(UserStore.getCurrentUser().id);
            update(false);
        }
    }, []);

    const ref = useRef<HTMLDivElement>(null);
    const tabRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setUpdaterFunction(update);
        const onLogin = () => {
            const { id } = UserStore.getCurrentUser();
            if (id === userId && openTabs.length) return;
            setUserId(id);

            openStartupTabs({ ...props, userId: id }, setUserId);
        };

        FluxDispatcher.subscribe("CONNECTION_OPEN_SUPPLEMENTAL", onLogin);
        return () => {
            FluxDispatcher.unsubscribe("CONNECTION_OPEN_SUPPLEMENTAL", onLogin);
        };
    }, []);

    useEffect(() => {
        (Vencord.Plugins.plugins.ChannelTabs as any).containerHeight = ref.current?.clientHeight;
    }, [userId, showBookmarkBar]);

    if (!userId) return null;
    handleChannelSwitch(props);
    saveTabs(userId);

    return <div
        className={cl("container")}
        ref={ref}
        onContextMenu={e => ContextMenuApi.openContextMenu(e, () => <BasicContextMenu />)}
    >
        <div className={cl("tab-container")}>
            {showHomeButton && <>
                <button
                    onClick={() => NavigationRouter.transitionTo("/channels/@me")}
                    className={clab("home")}
                >
                    <ClydeIcon height={20} width={20} color="currentColor" />
                </button>
                <div
                    className={cl("mentions")}
                >
                    {mentionCount > 0 &&
                        <MentionsBadge mentionsCount={(mentionCount > 99 ? "@" : mentionCount)} />
                    }
                </div>
            </>}
            <div
                className={cl("scroller")}
                onWheel={e => {
                    if (e.deltaY !== 0 && !e.shiftKey) {
                        // e.preventDefault();
                        const modifier = e.deltaY < 0 ? -1 : 1;
                        let index = ChannelTabsUtils.openTabs.findIndex(c => c.id === ChannelTabsUtils.getCurrentTabId()) + modifier;
                        if (index >= ChannelTabsUtils.openTabs.length) index = 0;
                        if (index < 0) index = ChannelTabsUtils.openTabs.length - 1;
                        ChannelTabsUtils.moveToTab(ChannelTabsUtils.openTabs[index].id);
                        // tabRef.current?.scrollIntoView({
                        //     inline: modifier > 0 ? "start" : "end"
                        // });
                    }
                }}
            >
                {openTabs.map((tab, i) => <button
                    className={classes(cl("button"), cl("tab"), tab.compact && cl("tab-compact"), isTabSelected(tab.id) && cl("tab-selected"))}
                    key={i}
                    onClick={() => moveToTab(tab.id)}
                    onAuxClick={e => {
                        if (e.button === 1 /* middle click */) {
                            closeTab(tab.id);
                            e.preventDefault();
                        }
                    }}
                    onContextMenu={e => ContextMenuApi.openContextMenu(e, () => <TabContextMenu tab={tab} />)}
                    ref={isTabSelected(tab.id) ? tabRef : undefined}
                >
                    <div
                        className={classes(cl("channel-info"))}
                    >
                        <ChannelTab {...tab} index={i} />

                        {openTabs.length > 1 && (tab.compact ? isTabSelected(tab.id) : true) && <button
                            className={classes(cl("button"), cl("close-button"), tab.compact ? cl("close-button-compact") : cl("hoverable"))}
                            onClick={() => closeTab(tab.id)}
                        >
                            <XIcon height={16} width={16} />
                        </button>}
                    </div>
                </button>)}
            </div>
            <button
                onClick={() => createTab(props, true)}
                className={clab("new")}
            >
                <PlusSmallIcon height={20} width={20} />
            </button>
            <div
                className={classes(cl("spacer"))}
            >
            </div >
            {showQuickSwitcher && <button
                onClick={() => FluxDispatcher.dispatch({
                    type: "QUICKSWITCHER_SHOW",
                    query: "",
                    queryMode: null
                })}
                className={clab("quick-switcher")}
            >
                <CompassIcon height={20} width={20} />
            </button>}
            {IS_VESKTOP && <WindowButtons />}
        </div >
        {showBookmarkBar && <>
            <div className={cl("separator")} />
            <BookmarkContainer {...props} userId={userId} />
        </>}
    </div>;
}

export function ChannelTabsPreview(p) {
    const id = UserStore.getCurrentUser()?.id;
    if (!id) return <Forms.FormText>there's no logged in account?????</Forms.FormText>;

    const { setValue }: { setValue: (v: { [userId: string]: ChannelTabsProps[]; }) => void; } = p;
    const { tabSet }: { tabSet: { [userId: string]: ChannelTabsProps[]; }; } = settings.use(["tabSet"]);

    const placeholder = [{ guildId: "@me", channelId: undefined as any }];
    const [currentTabs, setCurrentTabs] = useState(tabSet?.[id] ?? placeholder);

    return <>
        <Forms.FormTitle>Startup tabs</Forms.FormTitle>
        <Flex flexDirection="row" style={{ gap: "2px" }}>
            {currentTabs.map(t => <>
                <PreviewTab {...t} />
            </>)}
        </Flex>
        <Flex flexDirection="row-reverse">
            <Button
                onClick={() => {
                    setCurrentTabs([...ChannelTabsUtils.openTabs]);
                    setValue({ ...tabSet, [id]: [...ChannelTabsUtils.openTabs] });
                }}
            >Set to currently open tabs</Button>
        </Flex>
    </>;
}
