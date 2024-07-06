/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { findComponentByCodeLazy } from "@webpack";

// type InviteEmbedProps = {
//     af;
// };
const InviteEmbed = findComponentByCodeLazy("getAcceptInviteContext", "resolveInvite");

function InviteEmbedWrapper({ code }: { code: string; }) {
    if (!code) return null;
    return <InviteEmbed code={code} author={{ id: 0 }} />;
}

export default definePlugin({
    name: "JoinServerInviteEmbed",
    description: "Replaces the",
    enabledByDefault: true,
    authors: [Devs.Sqaaakoi],
    patches: [
        {
            find: "Messages.JOIN_SERVER_INVITE_EXAMPLES_HEADER",
            replacement: [
                {
                    match: /(\[(\i),\i\]=\i\.useState\(""\).{0,2000})\i\.FormItem,{title:\i.{0,10}\.Messages\.JOIN_SERVER_INVITE_EXAMPLES_HEADER.{0,200}?}\),/,
                    replace: "$1$self.InviteEmbedWrapper,{code:$2}),"
                }
            ]
        }
    ],
    InviteEmbedWrapper
});
