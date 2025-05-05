import { db } from "./db";
import { Sound } from "@prisma/client";

export const getSounds = async () => {
    const sounds: Sound[] = await db.sound.findMany();
    return sounds;
}
