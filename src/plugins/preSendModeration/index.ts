/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { addPreSendWarningEntry, PreSendWarningEntry, removePreSendWarningEntry } from "@api/MessageEvents";
import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

import { Filters } from "./filters";

const settings = definePluginSettings({
    excludedKeywords: {
        type: OptionType.STRING,
        description: "A list of excluded keywords / phrases, split by ,",
        default: "fuck, fucking, fucked, shit"
    },
});

export default definePlugin({
    name: "PreSendModeration",
    description: "Confirms that you want to send inappropriate content. Lists sourced from keyword filter experiment",
    dependencies: ["MessageEventsAPI"],
    authors: [Devs.Sqaaakoi],
    settings,

    preSendWarningEntry: {} as PreSendWarningEntry,
    start() {
        this.preSendWarningEntry = addPreSendWarningEntry(this.check);
    },
    stop() {
        removePreSendWarningEntry(this.preSendWarningEntry);
    },

    check(content: string) {
        const detectedWords = new Map<string, Set<string>>();
        for (const key in Filters) {
            const filter = Filters[key];
            const detections = Object.values(filter()(content) as Record<any, { keyword: string; }>).map(i => i.keyword).filter(i => !settings.store.excludedKeywords.replaceAll(", ", ",").split(",").includes(i));
            if (detections.length) detectedWords.set(key, new Set(detections));
        }
        if (detectedWords.size) return {
            body: "Your message may contain inappropriate content\n" +
                Array.from(detectedWords).map(([filter, words]) => `${filter}: ${[...words].join(", ")}`).join("\n"),
            footer: "These lists are provided by DIscord. You can make exceptions in the plugin settings."
        };
        return false;
    },

    Filters
});
