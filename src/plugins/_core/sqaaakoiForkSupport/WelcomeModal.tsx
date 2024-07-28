/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { DataStore } from "@api/index";
import { Margins } from "@utils/margins";
import { classes } from "@utils/misc";
import { closeModal, ModalContent, ModalFooter, ModalHeader, ModalProps, ModalRoot, ModalSize, openModal } from "@utils/modal";
import { findByPropsLazy } from "@webpack";
import { Button, Flex, Parser, RelationshipStore, Text, useEffect, UserStore, useState } from "@webpack/common";

import gitHash from "~git-hash";
import gitRemote from "~git-remote";

import { CURRENT_WELCOME_NOTICE_VERSION, LAST_UPDATED_AT, SQAAAKOI_USER_ID, WELCOME_BACK_HEADER, WELCOME_HEADER, WELCOME_MESSAGE, WELCOME_NOTICE_VERSION_KEY } from "./constants";

const CodeContainerClasses = findByPropsLazy("markup", "codeContainer");
const MiscClasses = findByPropsLazy("messageContent", "markupRtl");

const parseMarkdown = (text: string) => Parser.parse(text, true, {
    allowLinks: true,
    allowHeading: true,
    allowList: true,
    allowEmojiLinks: true,
});

// First time run card
export function WelcomeModal({ modalProps, close, isFriend, force, welcomeBack, text, callbackConfirm }: { modalProps: ModalProps; close: () => void; isFriend: boolean; force: boolean; welcomeBack: boolean; text: string; callbackConfirm: (confirm: () => void) => void; }) {
    const [unlocked, setUnlocked] = useState(force);
    const [closing, setClosing] = useState(false);
    useEffect(() => {
        setTimeout(() => setUnlocked(true), (isFriend ? 5000 : 15000) + ((Math.random() - 0.5) * 5));
    });

    const confirm = () => {
        setClosing(true);
        if (unlocked) setTimeout(() => setUnlocked(true), 1500 + ((Math.random() - 0.5) * 2));
    };
    callbackConfirm(confirm);

    if (closing && unlocked) {
        close();
        DataStore.set(WELCOME_NOTICE_VERSION_KEY, CURRENT_WELCOME_NOTICE_VERSION);
    }


    return <ModalRoot {...modalProps} size={ModalSize.MEDIUM} >
        <ModalHeader >
            <div
                className={classes(CodeContainerClasses.markup, MiscClasses.messageContent)}
                style={{ flexGrow: 1, textAlign: "center", margin: "-8px 0" }}
            >
                {parseMarkdown(welcomeBack ? WELCOME_BACK_HEADER : WELCOME_HEADER)}
            </div>
        </ModalHeader>
        <ModalContent className={classes(Margins.top8, Margins.bottom8)}>
            <div className={classes(CodeContainerClasses.markup, MiscClasses.messageContent)}>
                {parseMarkdown(text)}
            </div>
        </ModalContent>
        <ModalFooter>
            <Flex direction={Flex.Direction.HORIZONTAL_REVERSE}>
                <Button
                    color={Button.Colors.GREEN}
                    submitting={closing && !unlocked}
                    onClick={() => confirm()}
                >
                    Continue
                </Button>
                <Flex direction={Flex.Direction.HORIZONTAL}>
                    <div style={{ margin: "auto 0", color: "var(--text-muted)" }}>
                        <Text variant="text-xs/normal" color="currentColor">
                            {parseMarkdown(`Commit [${gitHash}](<https://github.com/${gitRemote}/commit/${gitHash}>)\
                                \nLast updated <t:${Math.floor(LAST_UPDATED_AT.getTime() / 1000)}:D>`)}
                        </Text>
                    </div>
                </Flex>
            </Flex>
        </ModalFooter>
    </ModalRoot >;
}

export async function openWelcomeModal(force: boolean) {
    let currentVersion: number | undefined;
    if (!force) {
        currentVersion = (await DataStore.get<number>(WELCOME_NOTICE_VERSION_KEY));
        currentVersion ??= 0;
        if (currentVersion >= CURRENT_WELCOME_NOTICE_VERSION) return;
    }
    const isFriend = RelationshipStore.isFriend(SQAAAKOI_USER_ID) || UserStore.getCurrentUser().id === SQAAAKOI_USER_ID;
    let confirm = () => { };
    const callbackConfirm = (fn: () => void) => confirm = fn;
    const key = openModal(modalProps => (
        <WelcomeModal
            modalProps={modalProps}
            close={() => closeModal(key)}
            isFriend={isFriend}
            force={force}
            welcomeBack={force || currentVersion !== 0}
            text={WELCOME_MESSAGE(isFriend)}
            callbackConfirm={callbackConfirm}
        />
    ), {
        onCloseRequest: () => confirm()
    });
}
