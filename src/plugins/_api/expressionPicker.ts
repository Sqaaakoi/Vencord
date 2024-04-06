/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { Devs } from "@utils/constants";
import definePlugin from "@utils/types";

export default definePlugin({
    name: "ExpressionPickerAPI",
    description: "API to add tabs to the expression picker",
    authors: [Devs.Sqaaakoi],
    required: true,
    patches: [
        {
            find: "Messages.EXPRESSION_PICKER_CATEGORIES_A11Y_LABEL,",
            replacement: [
                {
                    match: /(Messages\.EXPRESSION_PICKER_CATEGORIES_A11Y_LABEL,children:)(\[.{0,120}?:)(\i)(===\i\.ExpressionPickerViewType[^\]]*?\])/,
                    replace: "$1Vencord.Api.ExpressionPicker._patchTabButtons($3,$2$3$4)"
                },
                {
                    match: /,(\i)===\i\.ExpressionPickerViewType\.EMOJI.{0,20}\.default,(\{.{0,400}?\})\):null,/,
                    replace: ",Vencord.Api.ExpressionPicker._getTabView($1,$2)$&"
                }
            ]
        }
    ]
});
