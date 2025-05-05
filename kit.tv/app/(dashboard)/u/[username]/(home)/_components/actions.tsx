"use server";

import { getButtonQueue } from "@/lib/button-queue-service";
import { createButton, deleteButton, getButtons } from "@/lib/button-service";
import { Button } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const queryButtonsAction = async (userId: string) => {
  try {
    const buttons: Button[] = await getButtonQueue(userId);
    return { success: true, buttons };
  } catch (error) {
    console.error("Failed to query buttons:", error);
    return { success: false, error: "Failed to query buttons" };
  }
};




