import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from "@/lib/db"; 
import { clerkClient, getAuth } from '@clerk/nextjs/server';
 
export async function POST(req: NextApiRequest) {
    //verify authentication
    const { userId } = getAuth(req); //TODO this should probably be improved to check that the userId actually exists in clerk.
    if (userId == null) {
        console.log("Got POST request to pushInteractionButton with a not found userId");
        return new Response("User not found", {status: 400});
    }

    //verify req content is valid (request should contain buttonId and in the future, maybe the time it was pressed according to the client
    let buttonId, streamId: any; //TODO probably change this away from any
    try {
        buttonId = JSON.parse(req.body).buttonId;
        streamId = JSON.parse(req.body).streamId;
    } catch (error) {
        console.log("Error parsing request post content", error);
        return new Response("Invalid Input", {status: 400});
    }
    
    //get the button the id is assigned with
    const button = await db.button.findFirst({
        where: {
            buttonId: buttonId
        }
    });


    if (button == null) {
        console.log("Failed to find button with id:", buttonId);
        return new Response("Button ID Not Found", {status: 400});
    }

    //verify that the stream is live that the button should be clicked fo
    const stream = await db.activestream.findFirst({
        where: {
            id: streamId
        }
    });

    if (stream == null) {
        console.log("stream for requested button press is offline");
        return new Response("Stream is offline!", {status: 400});
    }

    //verify that the button streamerId lines up with the streamer
    if (button.streamerId != stream.streamUserId) {
        console.log("Streamer and button streamer IDs do not match!");
        return new Response("Button does not belong to requested streamer!", {status: 400});
    }

    //Check that the button is allowed to be added based on the last time the user has hit the button
    const prevButtons = await db.buttonqueue.findMany({
        where: {
            buttonId: buttonId, //button id from request
            timestamp: {
                gt: "TODO" //somehow get current time - the interval of the button + some buffer, might use a Date() object
            }
        }
    })

    if (prevButtons.length != 0) {
        console.log("Button request sent when it was already pressed before the end of the cooldown");
        return new Response("Button cooldown still active!", {status: 400});
    }

    //Add the button and then return
    const addButton = await db.buttonqueue.create({
        data: {
            buttonId: "TODO", 
            button: "TODO" //this might NOT have to be specified. instead we just specify the button ID
        }
    })
}