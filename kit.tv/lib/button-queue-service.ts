import { ActiveStream, Button } from "@prisma/client";
import { getSelf } from "./auth-service";
import { db } from "./db";


export const getButtonQueue = async () => {
    //verify auth
    const self = await getSelf();

    //verify streamer is live
    const stream = await db.activeStream.findFirst({
            where: {
                streamUserId: self.id
            }
    });

    //check if its empty. if it is, user isn't live
    if (stream === null) {
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

    //now return the button Ids
    return queuedButtons;
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
    const stream: ActiveStream | null = await db.activeStream.findFirst({
        where: {
            streamUserId: button.streamerId
        }
    });

    //check if its empty. if it is, user isn't live
    if (stream === null) {
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

