/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./ActivityFeedCard.css";

import { MouseEventHandler, ReactNode } from "react";

import { cl } from "./common";

export default function ActivityFeedCard(props: { onClick?: MouseEventHandler; label: string; children: ReactNode; }) {
    return <fieldset className={cl("card")} onClick={props.onClick} aria-label={props.label}>
        <legend className={cl("card-label")}>
            {props.label}
        </legend>
        <div className={cl("card-content")}>
            {props.children}
        </div>
    </fieldset >;
}
