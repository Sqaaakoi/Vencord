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

import "./style.css";

import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import { Logger } from "@utils/Logger";
import definePlugin from "@utils/types";
import { findStoreLazy } from "@webpack";
import { GuildStore, ScrollerThin, useMemo, UserStore } from "@webpack/common";
import { User } from "discord-types/general";

const GuildScheduledEventStore = findStoreLazy("GuildScheduledEventStore");

const getEvents = () => GuildStore.getGuildIds().flatMap(guildId => GuildScheduledEventStore.getGuildScheduledEventsForGuild(guildId));

const getMutualEvents = (userId: string) => {

};

const isBotOrSelf = (user: User) => user.bot || user.id === UserStore.getCurrentUser().id;

function getMutualEventCountText(user: User) {
    const count = getMutualEvents(user.id).length;
    return `${count === 0 ? "No" : count} Mutual Event${count !== 1 ? "s" : ""}`;
}

const IS_PATCHED = Symbol("MutualEvents.Patched");

export default definePlugin({
    name: "MutualEvents",
    description: "Shows mutual events in profiles",
    authors: [Devs.Sqaaakoi],

    patches: [
        {
            find: ".MUTUAL_FRIENDS?(",
            replacement: [
                {
                    match: /\i\.useEffect.{0,100}(\i)\[0\]\.section/,
                    replace: "$self.pushSection($1,arguments[0].user);$&"
                },
                {
                    match: /\(0,\i\.jsx\)\(\i,\{items:\i,section:(\i)/,
                    replace: "$1==='MUTUAL_EVENTS'?$self.renderMutuslEventsList(arguments[0]):$&"
                }
            ]
        }
    ],

    pushSection(sections: any[], user: User) {
        try {
            if (isBotOrSelf(user) || sections[IS_PATCHED]) return;

            sections[IS_PATCHED] = true;
            sections.push({
                section: "MUTUAL_GDMS",
                text: getMutualEventCountText(user)
            });
        } catch (e) {
            new Logger("MutualEvents").error("Failed to push mutual events section:", e);
        }
    },

    renderMutualGDMs: ErrorBoundary.wrap(({ user, onClose }: { user: User, onClose: () => void; }) => {
        const mutualGDms = useMemo(() => getMutualEvents(user.id), [user.id]);
        const entries = renderClickableGDMs(mutualGDms, onClose);

        return (
            <ScrollerThin
                className={ProfileListClasses.listScroller}
                fade={true}
                onClose={onClose}
            >
                {entries.length > 0
                    ? entries
                    : (
                        <div className={ProfileListClasses.empty}>
                            <div className={ProfileListClasses.emptyIconFriends}></div>
                            <div className={ProfileListClasses.emptyText}>No group dms in common</div>
                        </div>
                    )
                }
            </ScrollerThin>
        );
    }),
});
