/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { ReactNode } from "react";

const { Shaker } = findByPropsLazy("Shaker");

export default definePlugin({
    name: "ShakingText",
    description: "Adds a new markdown formatting that makes text $$shaky$$, inspired by the 3rd party WigglyText plugin",
    authors: [Devs.Sqaaakoi],

    patches: [
        {
            find: "parseToAST:",
            replacement: {
                match: /(parse[\w]*):(.*?)\((\i)\),/g,
                replace: "$1:$2({...$3,wiggly:$self.shakyRule}),",
            },
        },
    ],

    shakyRule: {
        order: 24,
        match: (source: string) => source.match(/^\$\$([\s\S]+?)\$\$(?!_)/),
        parse: (
            capture: RegExpMatchArray,
            transform: (...args: any[]) => any,
            state: any
        ) => ({
            content: transform(capture[1], state),
        }),
        react: (
            data: { content: any[]; },
            output: (...args: any[]) => ReactNode[]
        ) => {
            const traverse = (raw: any) => {
                const children = !Array.isArray(raw) ? [raw] : raw;

                let i = -1;
                for (const child of children) {
                    i++;
                    children[i] = <span style={{ display: "inline-flex" }}><Shaker key={i}>
                        {child}
                    </Shaker></span>;
                }

                return children;
            };

            return traverse(output(data.content));
        },
    }
});
