/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// Permissions most
export const trusted = "applications.commands bot identify openid".split(" ");

// Trusted if app is an in-app activity
// Should the guilds scope be here too?
export const activities = "rpc.voice.read rpc.activities.write guilds.members.read".split(" ");

// Will always be disabled by default
export const dangerous = "guilds.join".split(" ");
