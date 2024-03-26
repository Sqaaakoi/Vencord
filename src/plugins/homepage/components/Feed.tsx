/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./Feed.css";

import { findByPropsLazy, findComponentByCodeLazy, findStoreLazy } from "@webpack";
import { Button, ChannelStore, GuildStore, i18n, NavigationRouter, useStateFromStores } from "@webpack/common";

import ActivityFeedCard from "./ActivityFeedCard";
import { cl } from "./common";
import feedProvider, { FeedEntry } from "./feedProvider";

// const MessageContainer = findByCodeLazy("messageContainer", "childrenMessageContent");
const ChannelMessage = findComponentByCodeLazy("renderSimpleAccessories)");

const RecentMentionsStore = findStoreLazy("RecentMentionsStore");
const RecentMentionsManager = findByPropsLazy("fetchRecentMentions", "deleteRecentMention");


export default function Feed(props?: any) {
    useStateFromStores([RecentMentionsStore], () => RecentMentionsStore.getMentions());
    RecentMentionsManager.fetchRecentMentions();
    return <div className={cl("feed")}>
        {feedProvider().map((m: FeedEntry) =>
            <ActivityFeedCard
                label={m.label}
            >
                <div className={cl("card-spacer")}>
                    <ChannelMessage
                        message={m.message}
                        channel={ChannelStore.getChannel(m.message.getChannelId())}
                        compact={false}
                        className={cl("message")}
                    />
                </div>
                <div className={cl("card-buttons")}>
                    <Button
                        onClick={() => {
                            NavigationRouter.transitionToGuild(
                                GuildStore.getGuild(ChannelStore.getChannel(m.message.getChannelId()).getGuildId())?.id || "@me",
                                m.message.getChannelId(),
                                m.message.id
                            );
                        }}
                        color={Button.Colors.PRIMARY}
                    >
                        {i18n.Messages.JUMP}
                    </Button>
                    <Button
                        onClick={m.delete}
                        color={Button.Colors.RED}
                    >
                        Dismiss
                    </Button>
                </div>
            </ActivityFeedCard>
        )}
    </div>;
}
