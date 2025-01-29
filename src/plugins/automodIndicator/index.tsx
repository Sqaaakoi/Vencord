/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { SafetyIcon } from "@components/Icons";
import { Devs } from "@utils/constants";
import { getIntlMessage } from "@utils/discord";
import definePlugin from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { Text, Tooltip } from "@webpack/common";
import { Guild } from "discord-types/general";
import { Constants } from "discord-types/other";

const classes = findByPropsLazy("guildIconV2Container");
const iconClasses = findByPropsLazy("flowerStarContainer");
const tooltipClasses = findByPropsLazy("tooltipBodyContainer", "tooltipRemovePadding");

export default definePlugin({
    name: "AutomodIndicator",
    description: "Adds an indicator in servers where AutoMod or explicit image filtering is enabled",
    authors: [Devs.Sqaaakoi],

    patches: [
        {
            find: ".animatedBannerHoverLayer,onMouseEnter:",
            replacement: {
                match: /(?<=(\(0,\i\.jsx\)\()\i\.\i(,{guild:\i),isBannerVisible:\i}\),)/,
                replace: "$1$self.AutoModGuildIcon$2}),"
            }
        }
    ],

    AutoModGuildIcon({ guild }: { guild: Guild; }) {
        const hasAutoMod = guild.hasFeature("AUTO_MODERATION" as keyof Constants["GuildFeatures"]);
        const imageFilterDescriptions = ["", "EXPLICIT_CONTENT_FILTER_MEDIUM_DESCRIPTION_V2", "EXPLICIT_CONTENT_FILTER_HIGH_DESCRIPTION_V2"];
        const labels = [
            hasAutoMod && {
                key: "automod",
                label: getIntlMessage("GUILD_AUTOMOD_USERNAME"),
                description: getIntlMessage("GUILD_AUTOMOD_USERNAME") + " has been configured in this server."
            },
            guild.explicitContentFilter > 0 && {
                key: "explicitContentFilter",
                label: getIntlMessage("FORM_LABEL_EXPLICIT_CONTENT_FILTER_V2"),
                description: getIntlMessage(imageFilterDescriptions[guild.explicitContentFilter])
            },
        ].filter(Boolean) as { key: string; label: string; description: string; }[];
        if (!labels.length) return null;
        return <div className={classes.guildIconV2Container}>
            <Tooltip
                text={
                    <div className={tooltipClasses.tooltipBodyContainer}>
                        <Text
                            color="interactive-active"
                            variant="text-xs/bold"
                        >
                            {labels.map(l => l.label).join(" + ")}
                        </Text>
                        {labels.map(l => <Text
                            color="text-muted"
                            variant="text-xs/medium"
                            key={l.key}
                        >
                            {l.description}
                        </Text>)}
                    </div>
                }
                position="bottom"
                tooltipContentClassName={tooltipClasses.tooltipRemovePadding}
            >
                {tooltipProps => <div className={iconClasses.flowerStarContainer} {...tooltipProps}>
                    <SafetyIcon
                        width={16}
                        height={16}
                        color="var(--text-normal)"
                    />
                </div>}
            </Tooltip>
        </div>;
    }
});
