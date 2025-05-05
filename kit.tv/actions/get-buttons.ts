"use server";

import { pressButton } from "@/lib/button-queue-service";
import { getButtons } from "@/lib/button-service";
import { revalidatePath } from "next/cache";

export const getButtonsAction = async (streamUserId: string) => {
    try {
        const buttons = await getButtons(streamUserId);
        revalidatePath("/"); 
        return { success: true, buttons: buttons };
    } catch (error) {
        console.error("Error fetching buttons:", error);
        revalidatePath("/"); 
        return { success: false, error: "Error fetching buttons" };
    }
};

export const pressButtonAction = async (buttonId: string) => {
    try {
        const button = await pressButton(buttonId);
        revalidatePath("/"); 
        return { success: true, button: button };
    } catch (error) {
        console.error("Error pressing button:", error);
        revalidatePath("/"); 
        return { success: false, error: "Error pressing button" };
    }
};



