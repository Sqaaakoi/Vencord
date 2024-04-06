/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// eslint-disable-next-line unused-imports/no-unused-imports
import { Logger } from "@utils/Logger";
// eslint-disable-next-line unused-imports/no-unused-imports
import { Menu, React } from "@webpack/common";
import type { ReactElement, ReactNode } from "react";


/**
 * @param view The rendered menu
 * @param args Any arguments passed into making the context menu, like the guild, channel, user or message for example
 */
export type NavContextMenuPatchCallback = (children: Array<ReactElement | null>, ...args: Array<any>) => void;

export interface ContextMenuProps {
    contextMenuApiArguments?: Array<any>;
    navId: string;
    children: Array<ReactElement | null>;
    "aria-label": string;
    onSelect: (() => void) | undefined;
    onClose: (callback: (...args: Array<any>) => any) => void;
}

// const ContextMenuLogger = new Logger("ContextMenu");

export const tabs = new Map<string, Set<NavContextMenuPatchCallback>>();

// /**
//  * Add a context menu patch
//  * @param navId The navId(s) for the context menu(s) to patch
//  * @param patch The patch to be applied
//  */
// export function addContextMenuPatch(navId: string | Array<string>, patch: NavContextMenuPatchCallback) {
//     if (!Array.isArray(navId)) navId = [navId];
//     for (const id of navId) {
//         let contextMenuPatches = navPatches.get(id);
//         if (!contextMenuPatches) {
//             contextMenuPatches = new Set();
//             navPatches.set(id, contextMenuPatches);
//         }

//         contextMenuPatches.add(patch);
//     }
// }

// /**
//  * Add a global context menu patch that fires the patch for all context menus
//  * @param patch The patch to be applied
//  */
// export function addGlobalContextMenuPatch(patch: GlobalContextMenuPatchCallback) {
//     globalPatches.add(patch);
// }

// /**
//  * Remove a context menu patch
//  * @param navId The navId(s) for the context menu(s) to remove the patch
//  * @param patch The patch to be removed
//  * @returns Whether the patch was successfully removed from the context menu(s)
//  */
// export function removeContextMenuPatch<T extends string | Array<string>>(navId: T, patch: NavContextMenuPatchCallback): T extends string ? boolean : Array<boolean> {
//     const navIds = Array.isArray(navId) ? navId : [navId as string];

//     const results = navIds.map(id => navPatches.get(id)?.delete(patch) ?? false);

//     return (Array.isArray(navId) ? results : results[0]) as T extends string ? boolean : Array<boolean>;
// }


export function _patchTabButtons(focusedTab: string, buttons: ReactElement[]) {
    console.warn(focusedTab, buttons);
    return buttons;
}

export function _getTabView(focusedTab: string, propsFromEmojiView: any): ReactNode {
    console.warn(focusedTab, propsFromEmojiView);

    return null;
}
