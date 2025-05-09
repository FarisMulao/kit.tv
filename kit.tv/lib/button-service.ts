import { Button } from "@prisma/client";
import { getSelf } from "./auth";
import { db } from "./db";

export const getButtons = async (streamerId: string) => {
    //Verify user auth
    const self = await getSelf();

    //return list of buttons
    const buttonArray: Button[] = await db.button.findMany({
        where: {
            streamerId: streamerId
        }
    })

    return buttonArray;
}

export const createButton = async (button: Button) => {
    //verify user auth
    const self = await getSelf();

    //check to make sure authed user is creating a button for themselves and not someone else
    if (self.id !== button.streamerId) {
        return false; //TODO add logging here
    }

    const createButton = await db.button.create({
        data: {
            text: button.text,
            color: button.color,
            instructions: button.instructions,
            streamerId: button.streamerId,
            soundName: button.soundName && button.soundName !== "None" ? button.soundName : null,
        }
    });

    return true;
}

export const deleteButton = async (button: Button) => {
    //verify authed user matches the button owner
    const self = await getSelf();

    //check to make sure authed user is the one who owns the button tht will be deleted
    if (self.id !== button.streamerId) {
        return false; //TODO add logging here
    }

    //delete button
    const buttonDelete = await db.button.delete({
        where: {
            id: button.id
        }
    });

    return true;
}