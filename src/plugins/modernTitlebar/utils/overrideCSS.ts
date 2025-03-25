/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { createStyle, disableStyle, enableStyle } from "@api/Styles";
import { waitFor } from "@webpack";

interface LazyCSS {
    classes: string[];
    style(stylesModule: Record<string, string>): string;
}

const hoist = "body #app-mount";
const varname = "--vc-moderntitlebar-height";
const height = `var(${varname})`;

const selectors: LazyCSS[] = [
    // Sidebar top left corner
    {
        classes: ["sidebar", "sidebarListRounded"],
        style: m => `${hoist} .${m.sidebar} { border-radius: 8px 0 0; overflow: hidden; }`
    },
    // Layers but exclude chat sidebar
    {
        classes: ["bg", "layer", "baseLayer"],
        style: m => `${hoist} .${m.layer} { padding-top: ${height}; top: calc(-1 * ${height}); > * { ${varname}: 0; } } ${hoist} .${m.bg} { top: calc(-1 * ${height}); }`
    },
    // Loading screen??
    {
        classes: ["container", "statusLink"],
        style: m => `${hoist} .${m.container.split(" ")[0]} { padding-top: ${height}; top: calc(-1 * ${height}); }`
    },

    // {
    //     classes: ["standardSidebarView"],
    //     style: m => `${hoist} > :not[data-popout-root] .${m.standardSidebarView} { top: ${height}; } ${hoist} > [data-popout-root] .${m.standardSidebarView} { top: 0; }`
    // },
    // Popout content for chat sidebar
    {
        classes: ["popout", "content"],
        style: m => `${hoist} .${m.content} { ${varname}: 0; }`
    },

    {
        classes: ["videoHeight", "normal", "noChat"],
        style: m => `${hoist} .${m.videoHeight}.${m.normal} { top: calc(50vh - ${height}); } ${hoist} .${m.videoHeight}.${m.noChat} { top: calc(100vh - ${height}); }`
    },
    // Guilds list
    {
        classes: ["scroller", "unreadMentionsBar"],
        style: m => `${hoist} .${m.scroller} { padding-top: 4px; }`
    },
    // Fixes unrelated to Discord's own titlebar height

    // Modals and Context menus
    {
        classes: ["layerContainer", "clickTrapContainer"],
        style: m => `${hoist} .${m.layerContainer} { top: ${height}; }`
    },
];

const injectedStyles: string[] = [];

function injectSelector(lc: LazyCSS) {
    const styleName = `modernTitlebar-override:${lc.classes.join(".")}`;
    waitFor([...lc.classes], module => {
        injectedStyles.push(styleName);
        createStyle(styleName, lc.style(module));
    });
}

export function injectOverrides() {
    selectors.forEach(injectSelector);
}

export function enableStyles() {
    injectedStyles.forEach(enableStyle);
}

export function disableStyles() {
    injectedStyles.forEach(disableStyle);
}
