/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./Homepage.css";

import { cl } from "./common";
import WelcomeBackHeader from "./WelcomeBackHeader";

export default function Homepage(props?: any) {
    return <div className={cl("root")}>
        <WelcomeBackHeader />
    </div>;
}
