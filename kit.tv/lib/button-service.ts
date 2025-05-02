import { Button } from "@prisma/client";
import { getSelf } from "./auth-service";

export const getButtons = async (streamerId: string) => {
    //Verify user auth

    //check if streamer exists

    //return list of buttons
}

export const createButton = async (button: Button) => {
    //verify user auth
    const self = await getSelf();

    //TODO possible add checking here

    //Add button do database
}

export const deleteButton = async (button: Button) => {
    //verify authed user matches the button owner

    //delete button
}