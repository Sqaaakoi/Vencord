/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandInputType, ApplicationCommandOptionType, Command, findOption } from "@api/Commands";
import { Devs } from "@utils/constants";
import { getIntlMessage } from "@utils/discord";
import { proxyLazy } from "@utils/lazy";
import definePlugin from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { PermissionsBits, PermissionStore } from "@webpack/common";

const { sendPollMessage } = findByPropsLazy("sendPollMessage");

export default definePlugin({
    name: "PollCommands",
    description: "Adds commands to send polls",
    authors: [Devs.Sqaaakoi],
    dependencies: ["CommandsAPI"],
    commands: proxyLazy(() => {
        return [
            {
                name: "pollyn",
                description: "Ask a Yes/No question as a poll",
                options: [
                    {
                        name: "question",
                        description: getIntlMessage("CREATE_POLL_QUESTION_PLACEHOLDER"),
                        type: ApplicationCommandOptionType.STRING,
                        required: true,
                        maxLength: 300
                    },
                    {
                        name: "duration",
                        description: getIntlMessage("CREATE_POLL_DURATION_LABEL") + " in hours",
                        type: ApplicationCommandOptionType.INTEGER,
                        required: false,
                        minValue: 1,
                        maxValue: 768
                    },

                ],
                inputType: ApplicationCommandInputType.BUILT_IN,
                predicate: ctx => ctx.channel.isPrivate() || PermissionStore.canWithPartialContext(PermissionsBits.SEND_POLLS, { channelId: ctx.channel.id }),
                async execute(opts, ctx) {
                    const question = findOption(opts, "question", "");
                    const duration = findOption(opts, "duration", 24);

                    await sendPollMessage(ctx.channel.id, {
                        question: {
                            text: question
                        },
                        answers: ["Yes", "No"].map(i => ({
                            poll_media: {
                                text: i
                            }
                        })),
                        allow_multiselect: false,
                        duration,
                        layout_type: 1
                    }).catch(() => { throw "Failed to send poll"; });
                }
            },
        ] as Command[];
    })
});
