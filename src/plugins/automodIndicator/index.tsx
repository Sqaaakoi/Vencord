/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";
import { findByPropsLazy } from "@webpack";
import { i18n, Icons, Text, Tooltip } from "@webpack/common";
import { Guild } from "discord-types/general";
import { Constants } from "discord-types/other";

const classes = findByPropsLazy("guildIconV2Container");
const iconClasses = findByPropsLazy("flowerStarContainer");
const tooltipClasses = findByPropsLazy("tooltipBodyContainer", "tooltipRemovePadding");

export default definePlugin({
    name: "AutomodIndicator",
    description: "Adds an indicator in servers where AutoMod is enabled",
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
        if (!guild.hasFeature("AUTO_MODERATION" as keyof Constants["GuildFeatures"])) return null;
        return <div className={classes.guildIconV2Container}>
            <Tooltip
                text={
                    <div className={tooltipClasses.tooltipBodyContainer}>
                        <Text
                            color="interactive-active"
                            variant="text-xs/bold"
                        >
                            {i18n.Messages.GUILD_AUTOMOD_USERNAME}
                        </Text>
                        <Text
                            color="text-muted"
                            variant="text-xs/medium"
                        >
                            {i18n.Messages.GUILD_AUTOMOD_USERNAME} has been configured in this server.
                        </Text>
                    </div>
                }
                position="bottom"
                tooltipContentClassName={tooltipClasses.tooltipRemovePadding}
            >
                {tooltipProps => <div className={iconClasses.flowerStarContainer} {...tooltipProps}>
                    <Icons.ShieldIcon
                        size="xs"
                        color="var(--text-normal)"
                    />
                </div>}
            </Tooltip>
        </div>;
    }
});
