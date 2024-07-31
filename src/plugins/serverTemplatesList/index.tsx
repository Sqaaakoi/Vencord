/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./fixes.css";

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import { useAwaiter, useForceUpdater } from "@utils/react";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy, findStoreLazy } from "@webpack";
import { GuildStore, PermissionsBits, PermissionStore, React, useEffect, UserStore } from "@webpack/common";
import { ReactNode } from "react";

enum TemplatePositions {
    Above,
    Below,
    Disabled,
}

const { loadTemplatesForGuild } = findByPropsLazy("loadTemplatesForGuild", "openNativeAppModal");
const SortedGuildStore = findStoreLazy("SortedGuildStore");
const GuildTemplateStore = findStoreLazy("GuildTemplateStore");

const settings = definePluginSettings({
    defaultTemplatePosition: {
        description: "Position of default templates",
        type: OptionType.SELECT,
        options: [
            { label: "Above custom templates", value: TemplatePositions.Above },
            { label: "Below custom templates", value: TemplatePositions.Below, default: true },
            { label: "Custom templates only", value: TemplatePositions.Disabled },
        ]
    },
    myTemplatesOnly: {
        description: "Only show templates from servers you own",
        type: OptionType.BOOLEAN,
        default: false
    },
    skipCreationIntent: {
        description: "Always skips the useless friends/community step when creating a guild",
        type: OptionType.BOOLEAN,
        default: true
    }
});

const templateSubscribers = new Set<() => void>();

let fetchGuildTemplatesRatelimitedEnabled = true;

const utils = {
    getGuildIdsWithPermission: () => SortedGuildStore.getFlattenedGuildIds().filter(guildId => PermissionStore.canWithPartialContext(PermissionsBits.MANAGE_GUILD, { guildId })),
    async fetchGuildTemplates(instant: boolean) {
        const guilds = utils.getGuildIdsWithPermission();
        for (let i = 0; i < guilds.length; i++) {
            const req = loadTemplatesForGuild(guilds[i]);
            if (!instant) await req;
        }
    },
    async fetchGuildTemplatesRatelimited() {
        if (!fetchGuildTemplatesRatelimitedEnabled) return false;
        fetchGuildTemplatesRatelimitedEnabled = false;
        await utils.fetchGuildTemplates(false);
        templateSubscribers.forEach(cb => cb());
        setTimeout(() => {
            fetchGuildTemplatesRatelimitedEnabled = true;
        }, 60000);
        return true;
    },
    getGuildTemplates() {
        const user = UserStore.getCurrentUser();
        return utils.getGuildIdsWithPermission().filter((id: string) => settings.store.myTemplatesOnly ? GuildStore.getGuild(id)?.isOwner(user) : false).map(GuildTemplateStore.getForGuild).filter(Boolean);
    },
    getFormattedGuildTemplates: () => utils.getGuildTemplates().map((template: any) => ({
        id: template.sourceGuildId,
        code: template.code,
        label: template.name,
        vencordInjectedIcon: GuildStore.getGuild(template.sourceGuildId)?.getIconURL(128, true) || null
    })),
};

export default definePlugin({
    name: "ServerTemplatesList",
    description: "Customise the list of server templates",
    authors: [Devs.Sqaaakoi],
    settings,
    patches: [
        {
            find: "Messages.GUILD_TEMPLATE_SELECTOR_OPTION_HEADER",
            replacement: [
                // Guild icon, key is also used later for other identification
                {
                    match: /(icon:)((\i\.\i)\[(\i)\.\i\],)/,
                    replace: "$1$4.vencordInjectedIcon!==undefined?$4.vencordInjectedIcon||$3.CREATE:$2vencordInjectedIcon:typeof $4.vencordInjectedIcon==='string',"
                },
                // Inject templates
                {
                    match: /(GUILD_TEMPLATE_SELECTOR_OPTION_HEADER}\),)(\(0,\i\.\i\)\((\i).{0,30}onClick:(\i).{0,500}?)]}/,
                    replace: "$1...$self.injectTemplates($3,$4,[$2])]}"
                }
            ]
        },
        {
            // Force 48x48 round guild icons
            find: /"img",\{className:\i\.icon,alt:"",src:\i.{0,60}?text-md\/bold/,
            replacement: {
                match: /(\.icon)(,alt:"",src:(\i))/,
                replace: '$1+(arguments[0].vencordInjectedIcon?" vc-server-templates-list-guild-icon":"")$2'
            }
        },
        {
            // Change to template popup endpoint so we don't need to pass along ALL the channels and roles. Also counts
            find: "NetworkActionNames.GUILD_CREATE",
            replacement: [
                {
                    match: /(url:)(\i\.\i\.)GUILDS(,body:{.{0,40})(channels:(\i)\.channels.{0,150}?)},/,
                    replace: "$1$5.vencordInjectedIcon===undefined?$2GUILDS:$2UNRESOLVED_GUILD_TEMPLATE($5.code)$3...($5.vencordInjectedIcon===undefined?{}:{$4})},"
                }
            ]
        },
        {
            find: "ImpressionNames.GUILD_ADD_INTENT_SELECTION",
            predicate: () => settings.store.skipCreationIntent,
            replacement: [
                {
                    // back navigation
                    match: /\i===\i\.\i\.CUSTOMIZE_GUILD/,
                    replace: "false"
                },
                {
                    match: /CREATION_INTENT(?=.{0,30}GUILD_TEMPLATE_SELECTED)/,
                    replace: "CUSTOMIZE_GUILD"
                }
            ]
        }
    ],
    start() {
        utils.fetchGuildTemplatesRatelimited();
    },
    flux: {
        // probably a bad idea :trolley:
        GUILD_TEMPLATE_CREATE_SUCCESS: () => { utils.fetchGuildTemplatesRatelimited(); },
        GUILD_TEMPLATE_DELETE_SUCCESS: () => { utils.fetchGuildTemplatesRatelimited(); },
        GUILD_TEMPLATE_SYNC_SUCCESS: () => { utils.fetchGuildTemplatesRatelimited(); },
    },
    ...utils,
    injectTemplates(GuildTemplateButton: React.ComponentType<any>, clickHandler: React.PointerEventHandler, defaultTemplates: ReactNode[]) {
        const update = useForceUpdater();
        useEffect(() => {
            templateSubscribers.add(update);
            return () => {
                templateSubscribers.delete(update);
            };
        }, []);
        useAwaiter(() => utils.fetchGuildTemplatesRatelimited());
        const templateList = [] as ReactNode[];
        if (settings.store.defaultTemplatePosition === TemplatePositions.Above) templateList.push(...defaultTemplates);
        templateList.push(...utils.getFormattedGuildTemplates().map(template => <GuildTemplateButton
            guildTemplate={template}
            onClick={clickHandler}
        />));
        if (settings.store.defaultTemplatePosition === TemplatePositions.Below) templateList.push(...defaultTemplates);
        return templateList;
    }
});
