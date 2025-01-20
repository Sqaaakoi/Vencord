/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

export function adjustContextMenu(v: number) {
    return v > 40 ? v : 40;
}
