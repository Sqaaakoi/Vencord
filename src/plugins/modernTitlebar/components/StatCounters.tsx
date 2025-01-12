/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./StatCounters.css";

import { findStoreLazy } from "@webpack";
import { GuildStore, PresenceStore, RelationshipStore, useStateFromStores } from "@webpack/common";

import { settings } from "../settings";
import { cl } from "./TitleBar";

export default function StatCounters() {
    const { onlineFriendCount, serverCount } = settings.use(["onlineFriendCount", "serverCount"]);
    return <div className={cl("stat-counters")}>
        {onlineFriendCount && <FriendsIndicator />}
        {serverCount && <ServersIndicator />}
    </div>;
}

const UserGuildJoinRequestStore = findStoreLazy("UserGuildJoinRequestStore");

export function FriendsIndicator() {
    const onlineFriendsCount = useStateFromStores([RelationshipStore, PresenceStore], () => {
        let count = 0;

        const friendIds = RelationshipStore.getFriendIDs();
        for (const id of friendIds) {
            const status = PresenceStore.getStatus(id) ?? "offline";
            if (status === "offline") {
                continue;
            }

            count++;
        }

        return count;
    });

    return (
        <span id="vc-modernTitlebar-friendcount" className={cl("stat-counter")}>
            {onlineFriendsCount} online
        </span>
    );
}

function ServersIndicator() {
    const guildCount = useStateFromStores([GuildStore, UserGuildJoinRequestStore], () => {
        const guildJoinRequests: string[] = UserGuildJoinRequestStore.computeGuildIds();
        const guilds = GuildStore.getGuilds();

        // Filter only pending guild join requests
        return GuildStore.getGuildCount() + guildJoinRequests.filter(id => guilds[id] == null).length;
    });

    return (
        <span id="vc-modernTitlebar-guildcount" className={cl("stat-counter")}>
            {guildCount} servers
        </span>
    );
}

