/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./TotalMentionsBadge.css";

import { classes } from "@utils/misc";
import { findExportedComponentLazy, findStoreLazy } from "@webpack";
import { React, useStateFromStores } from "@webpack/common";

import { cl } from "./TitleBar";

const GuildReadStateStore = findStoreLazy("GuildReadStateStore");
const RelationshipStore = findStoreLazy("RelationshipStore");
const NotificationSettingsStore = findStoreLazy("NotificationSettingsStore");
const NumberBadge = findExportedComponentLazy("NumberBadge");
const TextBadge = findExportedComponentLazy("TextBadge");

export default function TotalMentionsBadge() {
    const mentionCount = useBadgeCount();
    return <div className={cl("mentions")}>
        {mentionCount > 0 && <div className={classes(cl("mentions-badge"))}>
            {mentionCount > 999 ?
                (mentionCount > 99999 ?
                    // Please seek help if this is ever rendered on your client.
                    <TextBadge className={cl("mentioned-icon")} text={"@"} /> :
                    <TextBadge className={cl("mentions-count")} text={`${Math.floor(mentionCount / 1000)}k`} />)
                : <NumberBadge className={cl("mentions-count")} count={mentionCount} />
            }
        </div>}
    </div>;
}

export function useBadgeCount() {
    return useStateFromStores([GuildReadStateStore, RelationshipStore, NotificationSettingsStore], () => {
        // Blatantly stolen from Discord's code
        const mentionCount = GuildReadStateStore.getTotalMentionCount();
        const pendingCount = RelationshipStore.getPendingCount();
        const anyUnread = GuildReadStateStore.hasAnyUnread();
        const disableBadge = NotificationSettingsStore.getDisableUnreadBadge();
        let sum = mentionCount + pendingCount;
        return sum === 0 && anyUnread && !disableBadge && (sum = -1), sum;
    });
}

