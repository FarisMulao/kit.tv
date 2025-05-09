import { Stream, ActiveStream, Button } from "@prisma/client";
import { getSelf } from "./auth";
import { db } from "./db";


export const getButtonQueue = async () => {
    //verify auth
    const self = await getSelf();

    //verify streamer is live
    const stream = await db.stream.findFirst({
            where: {
                userId: self.id
            }
    });

    //check if its empty. if it is, user isn't live
    if (stream === null) { // || !stream.isLive
        return []
    }

    //make database query to find buttons
    const queuedButtons = await db.buttonQueue.findMany({
        where: {
            streamerId: self.id
        }
    })

    //delete all buttons in query that were returned
    const deleteButtons = await db.buttonQueue.deleteMany({
        where: {
            id: {
                in: queuedButtons.map(qB => qB.id)
            }
        }
    })

    //get the buttons from the database that are in the queue
    //Note - this should be fine because the queuedButtons shouldnt have any duplicates
    const buttons = await db.button.findMany({
        where: {
            id: {
                in: queuedButtons.map(qB => qB.buttonId)
            }
        }
    })

    return buttons;
}

export const pressButton = async (buttonId: string) => {
    console.log("In press button function")
    //verify auth
    const self = await getSelf();

    //get button associated with id
    const button: Button | null = await db.button.findFirst({
        where: {
            id: buttonId
        }
    });
    console.log("Received button from button db with id")
    console.log(buttonId)
    console.log(button)
    if (button === null) {
        return false;
    }

    console.log("Checking if streamer is live")
    //verify streamer is live
    const stream: Stream | null = await db.stream.findFirst({
        where: {
            userId: button.streamerId
        }
    });

    console.log(stream)
    //check if its empty or the stream isnt live. if it is, user isn't live
    if (stream === null) { // || !stream.isLive
        return false;
    }

    console.log("checking button hasn't been pressed within its timeout already")
    //Verify the button hasn't been pressed too recently. to do this, we will query the button queue
    const recentButton = await db.buttonQueue.findFirst({
        where: {
            buttonId: buttonId, //TODO have this be per user
            timestamp: {
                gte: new Date(Date.now() - button.timeout)
            }
        }
    });

    console.log(recentButton)
    if (recentButton) {
        return false;
    }


    console.log("Attempting to add button to button queue")
    const addButton = await db.buttonQueue.create( {
        data: {
            buttonId: buttonId,
            streamerId: button.streamerId
        }
    })

    console.log(addButton)

    return !!addButton;
    //add button press to queue

}

