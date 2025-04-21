import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from "@/lib/db"; 
 
export async function POST(req: Request) {
    //verify authentication (maybe clerk has something for doing this properly)


    //verify req content is valid (request should contain buttonId and in the future, maybe the time it was pressed according to the client

    //get the button the id is assigned with

    //verify that the stream is live that the button should be clicked fo

    //Check that the button is allowed to be added based on the last time the user has hit the button
    const prevButtons = await db.buttonqueue.findMany({
        where: {
            buttonId: "TODO", //button id from request
            timestamp: {
                gt: "TODO" //somehow get current time - the interval of the button + some buffer, might use a Date() object
            }
        }
    })

    //TODO check that the length of prevButtons is zero. if it is, then we can continue. otherwise, the button has already been pressed
    
    //Add the button and then return
    const addButton = await db.buttonqueue.create({
        data: {
            buttonId: "TODO", 
            button: "TODO" //this might NOT have to be specified. instead we just specify the button ID
        }
    })
}