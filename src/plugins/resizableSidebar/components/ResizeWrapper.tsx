/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./ResizeWrapper.css";

import { React, useRef } from "@webpack/common";

import { settings } from "..";
import ResizeHandle from "./ResizeHandle";

export default function ResizeWrapper({ name: Sidebar, data, hidden }: { name: React.ElementType<any>; data: any; hidden: boolean; }) {
    const ref = useRef(null);
    const width = settings.store.width >= 0 ? settings.store.width + "px" : "";
    if (hidden) return null;
    return <div className="vc-resizable-sidebar-wrapper">
        <Sidebar {...{ ...data, ref, style: { width } }} />
        <ResizeHandle
            node={ref}
        />
    </div>;
}
