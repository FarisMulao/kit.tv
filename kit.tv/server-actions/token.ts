"use server";

import { v4 } from "uuid";
import { AccessToken } from "livekit-server-sdk";
import { getSelf } from "@/lib/auth";
import { getUserById } from "@/lib/user-service";

export const createViewerToken = async (hostIdentity: string) => {
    let self;

    try {
        self = await getSelf();
    } catch {
        const id = v4();
        const username = `guest${Math.floor(Math.random() * 10000)}`;
        self = { id, username };
    }

    const host = await getUserById(hostIdentity);

    if (!host) {
        throw new Error("Host not found");
    }

    const isHost = self.id === host.id;

    const token = new AccessToken(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, {
        identity: isHost ? `host-${self.id}` : self.id,
        name: self.username,
    });

    token.addGrant({
        roomJoin: true,
        room: host.id,
        canPublish: false,
        canPublishData: true
    });

    return await Promise.resolve(token.toJwt());
};