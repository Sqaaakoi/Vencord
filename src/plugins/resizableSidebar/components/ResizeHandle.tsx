/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./ResizeHandle.css";

import { classes } from "@utils/misc";
import { findByCodeLazy, findByPropsLazy } from "@webpack";

import { settings } from "..";

const createResizeHandler = findByCodeLazy("initialElementDimension:", "removeEventListener");

const styles = findByPropsLazy("resizeHandle", "chatLayerWrapper");

const saveWidth = (width: number) => { settings.store.width = width; };

export default function ResizeHandle({ node }: { node: React.MutableRefObject<any>; }) {
    const resizeHandler = createResizeHandler({
        minDimension: 0,
        maxDimension: 768,
        resizableDomNodeRef: node,
        onElementResize: saveWidth,
        onElementResizeEnd: () => { },
        orientation: 3 // ugly horrible hard-coded value
    });
    return <div className="vc-resizable-sidebar-handle-wrapper">
        <div
            onMouseDown={e => e.button !== 2 && resizeHandler(e)}
            onContextMenu={() => {
                node.current.style.width = "";
                setImmediate(() => saveWidth(-1));
            }}
            className={classes("vc-resizable-sidebar-handle", styles.resizeHandle)}
        />
    </div>;
}
