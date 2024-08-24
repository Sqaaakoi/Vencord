/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { findByCodeLazy, findLazy } from "@webpack";

// Existing lists
const profanity = findLazy(m => Array.isArray(m) && m.includes("fuck"));
const sexualContent = findLazy(m => Array.isArray(m) && m.includes("69ing"));
const slurs = findLazy(m => Array.isArray(m) && m.includes("fags"));

const splitWords = findByCodeLazy("/[\\p{Pd}\\p{Pc}\\p{Po}]/gu.test");

// Utility class
const Trie = findByCodeLazy("this.trie.suffix");

// horrible
const cache = (factory: () => any) => {
    let result: any;
    return () => {
        if (result === undefined) result = factory();
        return result;
    };
};

export const Filters = {
    Profanity: cache(() => {
        const trie = new Trie();
        trie.addWords(profanity);
        return (content: string) => trie.search(splitWords(content));
    }),
    "Sexual Content": cache(() => {
        const trie = new Trie();
        trie.addWords(sexualContent);
        return (content: string) => trie.search(splitWords(content));
    }),
    Slurs: cache(() => {
        const trie = new Trie();
        trie.addWords(slurs);
        return (content: string) => trie.search(splitWords(content));
    }),
};
