import { getSelf } from "./auth-service";
import { db } from "./db";


export const getButtonQueue = async () => {
    //verify auth
    const self = await getSelf();

    //verify streamer is live
    const stream = await db.activestream.findFirst({
            where: {
                streamUserId: self.id
            }
    });

    //check if its empty. if it is, user isn't live
    if (stream === null) {
        return []
    }

    //make database query to find buttons
    const queuedButtons = await db.ButtonQueue.findMany({
        where: {
            streamerId: self.id
        }
    })

    //delete all buttons in query that were returned
    const deleteButtons = await db.ButtonQueue.delete({
        where: {
            id: {
                in: queuedButtons.map((qB: { id: any; }) => qB.id)
            }
        }
    })

    //now return the button Ids
    return queuedButtons;
}

export const 