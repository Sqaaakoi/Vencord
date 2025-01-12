/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

import TitleBar from "./components/TitleBar";
import { settings } from "./settings";
import { startCallTimerSubscription, stopCallTimerSubscription } from "./utils/callTimer";

export default definePlugin({
    name: "ModernTitlebar",
    description: "Adds a thicker, more modern looking titlebar to Discord, without the Visual Refresh",
    authors: [Devs.Sqaaakoi],
    settings,
    patches: [
        {
            find: ".wordmarkWindows,",
            replacement: {
                match: /switch\(\i\)\{/,
                replace: "return $self.renderTitleBar(arguments[0]);switch(0){"
            }
        },
        // {
        //     find: 'setProperty("--custom-app-panels-height"',
        //     replacement: {
        //         match: /,\(0,\i\.jsx\).{0,30}?ACCOUNT_PANEL,.{0,30}?{}\)}\)/,
        //         replace: ""
        //     }
        // }
    ],
    renderTitleBar(props) {
        return <ErrorBoundary noop>
            <TitleBar {...props} />
        </ErrorBoundary>;
    },

    start() {
        startCallTimerSubscription();
    },
    stop() {
        stopCallTimerSubscription();
    }
});
