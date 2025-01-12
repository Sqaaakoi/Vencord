/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { waitFor } from "@webpack";
import { useState } from "@webpack/common";

interface LazyCSS {
    classes: string[];
    suffix?: string;
    properties: string;
}

const selectors: LazyCSS[] = [
    {
        classes: ["standardSidebarView"],
        properties: "top: var(--vc-moderntitlebar-height);"
    },
    // Does Discord even use this?
    // {
    //     classes: ["splashBackground", "loggingIn"],
    //     suffix: "::before",
    //     properties: "height: var(-vc-modernTitlebar-height);"
    // },
    {
        classes: ["scroller", "unreadMentionsBar"],
        properties: "padding-top: 4px;"
    },
    {
        classes: ["sidebar", "sidebarListRounded"],
        properties: "border-radius: 8px 0 0;\noverflow: hidden;"
    },
    {
        classes: ["layer", "bg", "baseLayer"],
        properties: "top: calc(-1 * var(--vc-moderntitlebar-height));\npadding-top: var(--vc-moderntitlebar-height);"
    },
    {
        classes: ["bg", "layer", "baseLayer"],
        properties: "top: calc(-1 * var(--vc-moderntitlebar-height));"
    },

    // Fixes unrelated to Discord's own titlebar height

    // Context menu overlapping
    {
        classes: ["layerContainer", "layerHidden"],
        properties: "top: var(--vc-moderntitlebar-height);"
    },
    // User profile popouts
    {
        classes: ["userPopoutInner"],
        properties: "max-height: calc(100vh - 28px - var(--custom-user-popout-outside-components-height) - var(--vc-moderntitlebar-height));"
    }
];

function InjectCSSWhenReady(props: { selector: LazyCSS; }) {
    const lc = props.selector;
    const [className, setClassName] = useState("");
    waitFor([...lc.classes], module => {
        if (!className) setClassName(`body #app-mount .${(module[lc.classes[0]] as unknown as string).replaceAll(" ", ".")}${lc.suffix ? " " + lc.suffix : ""}`);
    });
    return <style>
        {className.length ? (`${className} {\n${lc.properties}\n}`) : "/* Webpack find not finished yet */"}
    </style>;
}

export default function OverrideCSS(props: { className: string; }) {
    return <div className={props.className} style={{ display: "none" }}>
        { /* eslint-disable-next-line react/jsx-key */}
        {selectors.map(i => <InjectCSSWhenReady selector={i} />)}
    </div>;
}
