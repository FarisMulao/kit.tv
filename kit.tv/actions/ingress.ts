"use server";

import {IngressAudioEncodingPreset, IngressInput, IngressVideoEncodingPreset, IngressClient, RoomServiceClient, TrackSource, type CreateIngressOptions, IngressAudioOptions, IngressVideoOptions} from "livekit-server-sdk";
import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { revalidatePath } from "next/cache";

const roomSerice = new RoomServiceClient(
    process.env.LIVEKIT_API_URL!,
    process.env.LIVEKIT_API_KEY!, 
    process.env.LIVEKIT_API_SECRET!
);

const ingressClient = new IngressClient(
    process.env.LIVEKIT_API_URL!,
    process.env.LIVEKIT_API_KEY!, 
    process.env.LIVEKIT_API_SECRET!
)

export const resetIngresses = async (hostIdentity: string) => {
    const ingresses = await ingressClient.listIngress({roomName: hostIdentity});

    const rooms = await roomSerice.listRooms([hostIdentity]);

    for (const room of rooms) {
        await roomSerice.deleteRoom(room.name);
    }

    for (const ingress of ingresses) {
        if (ingress.ingressId) {
            await ingressClient.deleteIngress(ingress.ingressId);
        }
    }
};

export const createIngress = async (ingressType: IngressInput) => {
    const self = await getSelf();

    await resetIngresses(self.id);

    const options: CreateIngressOptions = {
        name: self.username,
        roomName: self.id,
        participantName: self.username,
        participantIdentity: self.id,
    };

    if (ingressType === IngressInput.WHIP_INPUT) {
        options.enableTranscoding = true;
    }
    else {
        const videoOptions = new IngressVideoOptions();
        videoOptions.source = TrackSource.CAMERA;
        videoOptions.encodingOptions = { 
            case: "preset", 
            value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS 
        };
        options.video = videoOptions;

        const audioOptions = new IngressAudioOptions();
        audioOptions.source = TrackSource.MICROPHONE;
        audioOptions.encodingOptions = { 
            case: "preset", 
            value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS 
        };
        options.audio = audioOptions;
    }

    const ingress = await ingressClient.createIngress(ingressType, options);

    if (!ingress || !ingress.url || !ingress.streamKey) {
        throw new Error("Failed to create ingress");
    }

    await db.stream.update({ where: { userId: self.id }, data: { ingressId: ingress.ingressId, serverUrl: ingress.url, streamKey: ingress.streamKey }});

    revalidatePath(`/u/${self.username}/keys`);

    return {
        ingressId: ingress.ingressId,
        serverUrl: ingress.url,
        streamKey: ingress.streamKey
    };
}
