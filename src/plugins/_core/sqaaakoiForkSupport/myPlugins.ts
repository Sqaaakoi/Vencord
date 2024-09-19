/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";

import plugins from "~plugins";

const getPlugins = () => Object.values({ ...plugins });

export const myOriginalPlugins = () => getPlugins().filter(p => p.authors.every(a => a?.id === Devs.Sqaaakoi.id));
export const myOriginalPluginsWithContributors = () => getPlugins().filter(p => p?.authors[0]?.id === Devs.Sqaaakoi.id);
export const pluginsIContributedTo = () => getPlugins().filter(p => p.authors.some(a => a?.id === Devs.Sqaaakoi.id));
