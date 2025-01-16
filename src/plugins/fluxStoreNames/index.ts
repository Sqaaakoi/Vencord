/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "FluxStoreNames",
    description: "Replaces the generated class names of FluxStores with their actual names",
    authors: [Devs.Sqaaakoi],
    patches: [
        {
            find: 'this,"_changeCallbacks",',
            replacement: {
                match: /\i\(this,"_changeCallbacks",/,
                replace: "Object.defineProperty(this,Symbol.toStringTag,{value:this.getName()}),$&"
            }
        }
    ]
});
