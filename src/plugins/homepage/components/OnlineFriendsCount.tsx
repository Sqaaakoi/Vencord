/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./OnlineFriendsCount.css";

import { useForceUpdater } from "@utils/react";
import { FluxDispatcher, PresenceStore, RelationshipStore, useEffect } from "@webpack/common";

import { cl } from "./common";

export function OnlineFriendsCount(props: any) {
    const forceUpdate = useForceUpdater();
    useEffect(() => {
        const cb = (e: any) => forceUpdate();
        FluxDispatcher.subscribe("PRESENCE_UPDATES", cb);
        return () => FluxDispatcher.unsubscribe("PRESENCE_UPDATES", cb);
    }, []);

    return (
        <span className={cl("online-friends-count")} {...props}>
            {countOnlineFriends()} online friends
        </span >
    );
}

function countOnlineFriends() {
    let onlineFriends = 0;
    const relations = RelationshipStore.getRelationships();
    for (const id of Object.keys(relations)) {
        const type = relations[id];
        // FRIEND relationship type
        if (type === 1 && PresenceStore.getStatus(id) !== "offline") {
            onlineFriends += 1;
        }
    }
    return onlineFriends;
}
