import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if(!WEBHOOK_SECRET){
        throw new Error("Missing Clerk Webhook Secret");
    }

    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id") as string;
    const svix_timestamp = headerPayload.get("svix-timestamp") as string;
    const svix_signature = headerPayload.get("svix-signature") as string;

    if(!svix_id || !svix_timestamp || !svix_signature){
        return new Response("Bad Request", {status: 400});
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {"svix-id" : svix_id, "svix-timestamp" : svix_timestamp, "svix-signature" : svix_signature}) as WebhookEvent;   
    }
    catch (err) {
        console.error("Error verifying webhook", err);
        return new Response("Error occured", {status: 400});
    }

    const eventType = evt.type;

    if(eventType === "user.created"){
        await db.user.create({
            data: {
                externalUserId: payload.data.id,
                username: payload.data.username,
                imageUrl: payload.data.image_url,
                stream : {
                    create: {
                        name: `${payload.data.username}'s Stream`,
                    }
                }
            }
        }); 
    }

    if(eventType === "user.updated"){
        await db.user.update({
            where: {
                externalUserId: payload.data.id
            },
            data: {
                username: payload.data.username,
                imageUrl: payload.data.image_url,
            }
        });
    }

    if(eventType === "user.deleted"){
        const user = await db.user.findUnique({
            where: { externalUserId: payload.data.id }
        });
          
        if (user) {
            await db.user.delete({
                where: { externalUserId: payload.data.id }
            });
        }
    }

    return new Response("OK", {status: 200});
}