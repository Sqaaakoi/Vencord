/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./fixes.css";

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { MouseEvent, MutableRefObject } from "react";

export default definePlugin({
    name: "ResizableSidebar",
    description: "Backports the resize handle from the visual refresh to the stable UI",
    authors: [Devs.Sqaaakoi],
    patches: [
        {
            find: "app view user trigger debugging",
            group: true,
            replacement: [
                // Pretend the experiment is enabled
                {
                    match: /\(0,\i\.\i\)\("ChannelSidebar"\)/,
                    replace: "true"
                },
                // Marker that plugin is enabled
                {
                    match: /\[\i\.hasNotice\]/,
                    replace: '"vc-resizable-sidebar-wrapper":true,$&'
                },
                // Wrap the resize element in a div so we can easily steal stock styles
                {
                    match: /"div"(,{className:\i\.sidebarResizeHandle,)/,
                    replace: "$self.WrapResizeBar$1"
                },
                // Make the width range larger
                {
                    match: /(minDimension):[0-9]+/,
                    replace: "$1:120"
                },
                {
                    match: /(maxDimension):[0-9]+/,
                    replace: "$1:768"
                },
                // Reset width
                {
                    match: /(resizableDomNodeRef:)(\i)(.{0,50}?onElementResize:)(\i)(,.{0,600}onMouseDownCapture:)(\i)/,
                    replace: "$1$2$3$4$5$self.onMouseDownCaptureWrapper($6,$4,$2),onMouseUp:$self.onMouseDownCaptureWrapper(null,$4,$2)"
                }
            ]
        }
    ],
    WrapResizeBar(props: any) {
        return <div className="vc-resizable-sidebar-stock-handle-wrapper visual-refresh">
            <div {...props} />
        </div>;
    },
    onMouseDownCaptureWrapper(action: (event: MouseEvent) => void | null, setWidth: (value: number) => void, domRef: MutableRefObject<HTMLDivElement>) {
        return (event: MouseEvent) => {
            console.warn(event, setWidth);
            if (event.button !== 2) return action(event);
            if (action !== null) return;
            event.stopPropagation();
            setWidth(240);
            domRef.current.style.width = "";
        };
    }
});
