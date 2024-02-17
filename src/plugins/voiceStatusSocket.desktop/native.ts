/*
 * Vencord, a Discord client mod
 * Copyright (c) 2023 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// I hate this file. It's a purely practical mess.

import { IpcMainInvokeEvent } from "electron";
import { Server, Socket } from "net";
import { join } from "path";

const SOCKET_BASE_PATH: string | undefined = (() => {
    if (process.env?.XDG_RUNTIME_DIR) return process.env.XDG_RUNTIME_DIR;
    if (process.platform === "win32") return "\\\\?\\pipe";
    // someone please make a case for macOS
})();

const SOCKET_PATH: string | null = SOCKET_BASE_PATH ? join(SOCKET_BASE_PATH, "vencord-voice-status") : null;

export function isSupported() {
    return SOCKET_BASE_PATH !== undefined;
}

let srv: Server;
let connections: Socket[] = [];

const doNothing = async () => { };
let execRemote: Function = doNothing;

function remoteCall(data: string) {
    execRemote(`Vencord.Plugins.plugins.VoiceStatusSocket.callCommand(${JSON.stringify(data)}, true);`);
}

function unregisterSocket(s: Socket) {
    const i = connections.indexOf(s);
    if (i > -1) {
        connections.splice(i, 1);
    }
}

function socketHandler(s: Socket) {
    connections.push(s);
    s.on("error", () => {
        s.destroy();
        unregisterSocket(s);
    });
    s.on("close", () => unregisterSocket(s));
    let lastData = "";
    s.on("data", b => {
        const bufStr = lastData + b.toString("utf8");
        const bufCommands = bufStr.split("\n");
        console.log(bufCommands);
        for (let i = 0; i < bufCommands.length - 1; i++) {
            remoteCall(bufCommands[i]);
        }
        lastData = bufCommands[bufCommands.length - 1];
    });
    remoteCall("broadcastState");
}

export function init(ipce: IpcMainInvokeEvent) {
    if (!isSupported()) return;
    stop();
    // The bind call is required
    execRemote = ipce.sender.executeJavaScript.bind(ipce.sender);
    console.log(execRemote);

    try {
        srv = new Server(socketHandler);
        // Who cares?
        srv.on("error", () => {
        });
        srv.listen(SOCKET_PATH);
    } catch (e) { }
}

export function stop() {
    if (srv) {
        srv.close();
        connections.forEach(s => s.destroy());
        connections = [];
    }
    execRemote = doNothing;
}

export function broadcast(_, data: string) {
    connections.forEach(s => {
        s.write(data + "\n");
    });
}
