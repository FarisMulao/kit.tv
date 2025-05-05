"use server";

import { getButtons } from "@/lib/button-service";
import { revalidatePath } from "next/cache";

export const getButtonsAction = async (streamUserId: string) => {
    try {
        const buttons = await getButtons(streamUserId);
        revalidatePath("/"); 
        return { success: true, buttons: buttons };
    } catch (error) {
        console.error("Error fetching buttons:", error);
        return { success: false, error: "Error fetching buttons" };
    }
};

