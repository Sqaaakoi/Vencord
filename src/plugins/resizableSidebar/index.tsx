/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./fixes.css";

import { definePluginSettings } from "@api/Settings";
import { Devs } from "@utils/constants";
import definePlugin, { OptionType } from "@utils/types";

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
                match: /\(0,\i\.jsxs\)(?=\("div",{className:\i\(\)\(\i\.sidebar.{0,200}?\.hidden\]:(\i))/,
                replace: "($self.wrapSidebar($1))"
            }
        }
    ],
    wrapSidebar(hidden: boolean) {
        return (name: string, data: any) => {
            return <ResizeWrapper name={name} data={data} hidden={hidden} />;
        };
    }
});
