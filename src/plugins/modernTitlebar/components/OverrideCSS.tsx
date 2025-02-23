/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { waitFor } from "@webpack";
import { useState } from "@webpack/common";

interface LazyCSS {
    classes: string[];
    style(stylesModule: Record<string, string>): string;
}

const hoist = "body #app-mount";
const height = "var(--vc-moderntitlebar-height)";

const selectors: LazyCSS[] = [
    // Sidebar top left corner
    {
        classes: ["sidebar", "sidebarListRounded"],
        style: m => `${hoist} .${m.sidebar} { border-radius: 8px 0 0; overflow: hidden; }`
    },
    // Layers
    {
        classes: ["bg", "layer", "baseLayer"],
        style: m => `${hoist} .${m.layer} { padding-top: ${height}; top: calc(-1 * ${height}); } ${hoist} .${m.bg} { top: calc(-1 * ${height}); }`
    },
    // Loading screen??
    {
        classes: ["container", "statusLink"],
        style: m => `${hoist} .${m.container.split(" ")[0]} { padding-top: ${height}; top: calc(-1 * ${height}); }`
    },

    {
        classes: ["standardSidebarView"],
        style: m => `${hoist} > :not[data-popout-root] ${m.standardSidebarView} { top: ${height}; } ${hoist} > [data-popout-root] .${m.standardSidebarView} { top: 0; }`
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

    // Modals
    {
        classes: ["layer", "hidden"],
        style: m => `${hoist} .${m.layer} { top: ${height}; }`
    },
];

function InjectCSSWhenReady(props: { selector: LazyCSS; }) {
    const lc = props.selector;
    const [stylesModule, setStylesModule] = useState(undefined);
    waitFor([...lc.classes], module => {
        if (stylesModule === undefined) setStylesModule(module);
    });
    let result = "/* Webpack find not finished yet */";
    try {
        if (stylesModule !== undefined) result = lc.style(stylesModule);
    } catch (e) {
        console.error(e);
        result = "/* Style errored.*/";
    }
    return <style>{result}</style>;
}

export default function OverrideCSS(props: { className: string; }) {
    return <div className={props.className} style={{ display: "none" }}>
        {selectors.map((lc, i) => <InjectCSSWhenReady selector={lc} key={i} />)}
    </div>;
}
