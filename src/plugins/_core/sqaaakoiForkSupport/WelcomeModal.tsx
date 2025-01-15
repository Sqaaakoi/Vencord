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
import { Button, ComponentDispatch, Flex, FluxDispatcher, Parser, RelationshipStore, Text, UserStore } from "@webpack/common";

import gitHash from "~git-hash";
import gitRemote from "~git-remote";

import { settings } from ".";
import { CURRENT_WELCOME_NOTICE_VERSION, LAST_UPDATED_AT, SQAAAKOI_USER_ID, WELCOME_BACK_HEADER, WELCOME_HEADER, WELCOME_MESSAGE, WELCOME_NOTICE_VERSION_KEY } from "./constants";

const CodeContainerClasses = findByPropsLazy("markup", "codeContainer");
const MiscClasses = findByPropsLazy("messageContent", "markupRtl");

const parseMarkdown = (text: string) => Parser.parse(text, true, {
    allowLinks: true,
    allowHeading: true,
    allowList: true,
    allowEmojiLinks: true,
});

const markAsRead = () => DataStore.set(WELCOME_NOTICE_VERSION_KEY, CURRENT_WELCOME_NOTICE_VERSION);

// First time run card
export function WelcomeModal({ modalProps, close, welcomeBack, text }: { modalProps: ModalProps; close: (wow: boolean) => void; welcomeBack: boolean; text: string; }) {
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
                    onClick={() => {
                        close(true);
                    }}
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
        if (!settings.store.welcomeModalOnStartup) return;
        currentVersion = (await DataStore.get<number>(WELCOME_NOTICE_VERSION_KEY));
        currentVersion ??= 0;
        if (currentVersion >= CURRENT_WELCOME_NOTICE_VERSION) return;
    }
    const isFriend = RelationshipStore.isFriend(SQAAAKOI_USER_ID) || UserStore.getCurrentUser().id === SQAAAKOI_USER_ID;
    let key = "";
    const close = (wow: boolean) => {
        closeModal(key);
        markAsRead();
        if (!wow) return;
        FluxDispatcher.dispatch({ type: "PURCHASED_ITEMS_FESTIVITY_SET_CAN_PLAY_WOW_MOMENT", value: true });
        ComponentDispatch.dispatch("PREMIUM_SUBSCRIPTION_CREATED");
    };
    key = openModal(modalProps => (
        <WelcomeModal
            modalProps={modalProps}
            close={close}
            welcomeBack={force || currentVersion !== 0}
            text={WELCOME_MESSAGE(isFriend)}
        />
    ), {
        onCloseRequest: () => close(false)
    });
}
