/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./ResizeWrapper.css";

import { ReactNode } from "react";

import ResizeHandle from "./ResizeHandle";

export default function ResizeWrapper({ children, childRef }: { children: ReactNode; childRef: React.MutableRefObject<any>; }) {
    return <div className="vc-resizable-sidebar-wrapper">
        {children}
        <ResizeHandle
            node={childRef}
        />
    </div>;
}
