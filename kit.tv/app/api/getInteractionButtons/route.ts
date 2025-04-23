import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";
import { db } from "@/lib/db"; 
import { headers } from "next/headers";


export async function GET(req: NextApiRequest) {
    //verify authentication
    const { userId } = getAuth(req); //TODO this should probably be improved to check that the userId actually exists in clerk.
    if (userId == null) {
        console.log("Got POST request to pushInteractionButton with a not found userId");
        return new Response("User not found", {status: 400});
    }

    //verify streamer is live
    const stream = await db.activestream.findFirst({
        where: {
            streamUserId: userId
        }
    });

    if (stream == null) {
        return new Response("Stream is offline!", {status: 500});
    }

    //make database query
    const buttons = await db.ButtonQueue.findMany({
        where: {
            //TODO Fifgure how how to join this table with the button table in prisma
        }
    })

    //TODO return list of buttonIds
}