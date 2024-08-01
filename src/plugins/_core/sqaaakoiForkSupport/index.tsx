/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandInputType } from "@api/Commands";
import { addPreSendWarningEntry, PreSendWarningEntry, removePreSendWarningEntry } from "@api/MessageEvents";
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType, Plugin } from "@utils/types";

import { myOriginalPlugins, myOriginalPluginsWithContributors, pluginsIContributedTo } from "./myPlugins";
import { openWelcomeModal, WelcomeModal } from "./WelcomeModal";

export const settings = definePluginSettings({
    welcomeModalOnStartup: {
        description: "Shows the Welcome / What's New popup on startup, if the contents have changed since the last time you viewed it",
        type: OptionType.BOOLEAN,
        default: true
    },
    warningsWhenAskingForSupport: {
        description: "Display warnings when asking for support with one of my plugins",
        type: OptionType.BOOLEAN,
        default: true
    }
});

export default definePlugin({
    name: "SqaaakoiForkSupport",
    required: true,
    description: "Utility to assist users to use the fork properly",
    authors: [Devs.Sqaaakoi],
    dependencies: ["CommandsAPI", "MessageEventsAPI"],
    settings,

    WelcomeModal,
    openWelcomeModal,

    commands: [{
        name: "welcome-modal",
        description: "Show first time run modal",
        inputType: ApplicationCommandInputType.BUILT_IN,
        async execute() {
            openWelcomeModal(true);
        }
    }],

    flux: {
        async POST_CONNECTION_OPEN() {
            openWelcomeModal(false);
        }
    },
    preSendWarningEntry: {} as PreSendWarningEntry,
    start() {
        this.preSendWarningEntry = addPreSendWarningEntry((content, channel) => {
            if (!settings.store.warningsWhenAskingForSupport) return false;
            if (!(channel.id === "1026515880080842772" || channel.id === "1015060231060983891" || channel?.parent_id === "1216095839848501338")) return false;
            const conditions: { plugins: Plugin[]; comment: (pluginName: string) => string; }[] = [
                {
                    plugins: myOriginalPlugins(),
                    comment: p => `developed by Sqaaakoi. If you need support with ${p} or to report an issue, visit the GitHub issue tracker linked below instead of sending a message here.`
                },
                {
                    plugins: myOriginalPluginsWithContributors(),
                    comment: p => `originally developed by Sqaaakoi. If you need support with ${p} or to report an issue, it is best to visit the GitHub issue tracker linked below.`
                },
                {
                    plugins: pluginsIContributedTo(),
                    comment: () => "with significant changes in Sqaaakoi's Vencord fork or that Sqaaakoi contributed to. You might want to consider asking Sqaaakoi if these changes are from the fork. You can do this by going to the GitHub issue tracker linked below."
                }
            ];
            for (const i in conditions) {
                const condition = conditions[i];
                for (const j in condition.plugins) {
                    const plugin = condition.plugins[j];
                    if (content.toLowerCase().includes(plugin.name.toLowerCase())) {
                        return {
                            body: `It seems like you might be asking for support with ${plugin.name}, which is a plugin ${condition.comment(plugin.name)}`,
                            footer: "https://github.com/Sqaaakoi/Vencord/issues"
                        };
                    }
                }
            }
            return false;
        });
    },
    stop() {
        removePreSendWarningEntry(this.preSendWarningEntry);
    }
});
