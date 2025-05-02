import { Button } from "@prisma/client";
import { getSelf } from "./auth-service";
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

    //TODO add check to make sure authed user is creating a button for themselves and not someone else

    const createButton = await db.button.create({
        data: button
    });

    return true;
}

export const deleteButton = async (button: Button) => {
    //verify authed user matches the button owner
    const self = await getSelf();

    //TODO add check to make sure authed user is the one who owns the button tht will be deleted

    //delete button
    const buttonDelete = await db.button.delete({
        where: {
            id: button.id
        }
    });

    return true;
}