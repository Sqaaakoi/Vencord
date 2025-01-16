/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { User } from "discord-types/general";

import DeafenButton from "./buttons/DeafenButton";
import MuteButton from "./buttons/MuteButton";

export default function ActionButtons(props: { user: User | undefined; }) {
    return <ErrorBoundary noop>
        <MuteButton />
        <DeafenButton />
    </ErrorBoundary>;
}
