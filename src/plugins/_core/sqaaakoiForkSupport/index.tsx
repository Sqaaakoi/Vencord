/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandInputType } from "@api/Commands";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

import { openWelcomeModal, WelcomeModal } from "./WelcomeModal";

export default definePlugin({
    name: "SqaaakoiForkSupport",
    required: true,
    description: "Utility to assist users to use the fork properly",
    authors: [Devs.Sqaaakoi],
    dependencies: ["CommandsAPI", "MessageEventsAPI"],

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
});
