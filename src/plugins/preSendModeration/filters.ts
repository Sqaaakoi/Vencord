/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findByCodeLazy, findLazy } from "@webpack";

const splitWords = findByCodeLazy("/[\\p{Pd}\\p{Pc}\\p{Po}]/gu.test");

// Utility class
const Trie = findByCodeLazy("this.trie.suffix");

const makeTrieSearchFromWordListItem = (item: any) => {
    let module: any[];
    const trie = new Trie();
    return (search: string) => {
        if (module === undefined) {
            module = findLazy(m => Array.isArray(m) && m.includes(item));
            trie.addWords(module);
        }
        return trie.search(splitWords(search));
    };
};

export const Filters = {
    Profanity: makeTrieSearchFromWordListItem("fuck"),
    "Sexual Content": makeTrieSearchFromWordListItem("69ing"),
    Slurs: makeTrieSearchFromWordListItem("fags"),
};
