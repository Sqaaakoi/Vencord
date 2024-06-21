/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./fixes.css";

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";
import { useRef } from "@webpack/common";
import { ReactNode } from "react";

import ResizeWrapper from "./components/ResizeWrapper";

export const settings = definePluginSettings({
    width: {
        type: OptionType.NUMBER,
        description: "Current sidebar width (set to -1 to reset)",
        default: -1,
    }
});

export default definePlugin({
    name: "ResizableSidebar",
    description: "Adds a resize handle to the sidebar",
    authors: [Devs.Sqaaakoi],
    settings,
    patches: [
        {
            find: "app view user trigger debugging",
            replacement: {
                match: /\(0,\i.jsxs\)(?=\("div",{className:\i\(\)\(\i\.sidebar)/,
                replace: "($self.wrapSidebar($&))"
            }
        }
    ],
    wrapSidebar(jsxs) {
        return (name: string, data: any) => {
            const ref = useRef(null);
            const width = settings.store.width > 0 ? settings.store.width + "px" : "";
            const component: ReactNode = jsxs(name, Object.assign(data, { ref, style: { width } }));
            return <ResizeWrapper childRef={ref} children={component} />;
        };
    }
});
