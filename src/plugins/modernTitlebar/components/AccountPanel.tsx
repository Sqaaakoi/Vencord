/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { filters, waitFor } from "@webpack";

let AccountPanelComponent = () => null;
waitFor(filters.componentByCode("{avatar:[],settings:[]}"), m => AccountPanelComponent = m);

export default function AccountPanel() {
    return <AccountPanelComponent />;
}
