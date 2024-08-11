/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { LogIcon } from "@components/Icons";
import { findByPropsLazy, findComponentByCodeLazy, findLazy } from "@webpack";
import { GuildStore, useStateFromStores } from "@webpack/common";

const PageWrapper = findComponentByCodeLazy("forumOrHome]:null");
const mainClasses = findByPropsLazy("chat", "threadSidebarOpen");
const iconClasses = findByPropsLazy("icon", "hamburger");
const headerClasses = findByPropsLazy("header", "innerHeader", "tabBar");

const { Title, Icon } = findLazy(m => ["Icon", "Title", "Divider", "Caret"].every(i => Object.prototype.hasOwnProperty.call(m, i)));

export default function AuditLogPage({ guildId }: { guildId: string; }) {
    const guild = useStateFromStores([GuildStore], () => GuildStore.getGuild(guildId));




    return <div className={mainClasses.chat}>
        <PageWrapper
            className={headerClasses.header}
            innerClassName={headerClasses.innerHeader}
            hideSearch={true}
            channelId="audit-log"
            guildId={guildId}
            toolbar={[]}
        >
            <Icon icon={LogIcon} />
            <Title>Audit Log</Title>
        </PageWrapper>

    </div>;
}
