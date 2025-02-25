/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./Pill.css";

import { classes } from "@utils/misc";
import { Icon } from "@webpack/types";
import { ButtonHTMLAttributes, ReactNode } from "react";

import { cl } from "./TitleBar";

export default function Pill(props: {
    action?(): void;
    className: string;
    icon?: Icon;
    children?: ReactNode;
    pillProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}) {
    return <button
        onClick={props.action}
        className={classes(cl("pill"), props.className)}
        {...props.pillProps}
    >
        <div className={cl("pill-inner")}>
            {props.children}
        </div>
    </button>;
}
