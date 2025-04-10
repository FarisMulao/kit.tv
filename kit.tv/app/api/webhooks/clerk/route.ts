import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

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

    const { id } = evt.data;
    const eventType = evt.type;

    console.log("Webhook with an ID of ${id} and type of ${eventType} has been received");
    console.log("Webhook body: ", body);

    return new Response("OK", {status: 200});
}