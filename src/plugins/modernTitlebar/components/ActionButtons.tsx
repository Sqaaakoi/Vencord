/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";

import MuteButton from "./buttons/MuteButton";

export default function ActionButtons() {
    return <ErrorBoundary noop>
        <MuteButton />
    </ErrorBoundary>;
}
