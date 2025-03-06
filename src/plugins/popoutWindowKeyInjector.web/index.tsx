/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "PopoutWindowKeyInjector",
    description: "Adds the window key to popout windows as a URL fragment",
    authors: [Devs.Sqaaakoi],
    patches: [
        {
            find: "Already has open window",
            replacement: {
                match: /(window\.open.{0,20}?POPOUT_WINDOW),(\i),/,
                replace: '$1+"#windowKey="+$2,$2,'
            }
        }
    ]
});
