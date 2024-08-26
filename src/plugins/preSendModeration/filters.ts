/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { find, findByCodeLazy } from "@webpack";

const splitWords = findByCodeLazy("/[\\p{Pd}\\p{Pc}\\p{Po}]/gu.test");

// Utility class
const Trie = findByCodeLazy("this.trie.suffix");

const makeTrieSearchFromWordListItem = (item: any) => {
    let trie: typeof Trie;
    return (search: string) => {
        if (trie === undefined) {
            trie = new Trie();
            trie.addWords(find(m => Array.isArray(m) && m.includes(item)));
        }
        return trie.search(splitWords(search));
    };
};

export const Filters = {
    Profanity: makeTrieSearchFromWordListItem("fuck"),
    "Sexual Content": makeTrieSearchFromWordListItem("69ing"),
    Slurs: makeTrieSearchFromWordListItem("fags"),
} as Record<PropertyKey, (search: string) => any>;
