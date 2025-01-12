/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./TitleBarButton.css";

import { classes } from "@utils/index";
import { Icon } from "@webpack/types";
import { ButtonHTMLAttributes, ReactNode } from "react";

import { cl } from "./TitleBar";

export default function TitleBarButton(props: {
    action(): void;
    className: string;
    icon?: Icon;
    children?: ReactNode;
    buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}) {
    return <button
        onClick={props.action}
        className={classes(cl("button"), props.className)}
        {...props.buttonProps}
    >
        <div className={cl("button-inner")}>
            {props.icon ?
                <props.icon height={20} width={20} color="currentColor" /> :
                props.children
            }
        </div>
    </button>;
}
