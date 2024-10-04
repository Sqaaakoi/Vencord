/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useEffect } from "@webpack/common";

import { route, setHomeLink } from "..";


export default function ServersPage() {
    useEffect(() => setHomeLink(route), []);
    return "hi";
}
