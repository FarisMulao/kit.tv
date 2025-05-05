import { Stream, ActiveStream, Button } from "@prisma/client";
import { getSelf } from "./auth-service";
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
    if (stream === null || !stream.isLive) {
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
    //verify auth
    const self = await getSelf();

    //get button associated with id
    const button: Button | null = await db.button.findFirst({
        where: {
            id: buttonId
        }
    });

    if (button === null) {
        return false;
    }

    //verify streamer is live
    const stream: Stream | null = await db.stream.findFirst({
        where: {
            userId: button.streamerId
        }
    });

    //check if its empty or the stream isnt live. if it is, user isn't live
    if (stream === null || !stream.isLive) {
        return false;
    }

    //Verify the button hasn't been pressed too recently. to do this, we will query the button queue
    const recentButton = await db.buttonQueue.findFirst({
        where: {
            buttonId: buttonId,
            timestamp: {
                gte: new Date(Date.now() - button.timeout)
            }
        }
    });

    if (recentButton) {
        return false;
    }

    const addButton = await db.buttonQueue.create( {
        data: {
            buttonId: buttonId,
            streamerId: button.streamerId
        }
    })

    return !!addButton;
    //add button press to queue

}

