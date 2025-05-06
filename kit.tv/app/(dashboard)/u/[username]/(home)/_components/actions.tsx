"use server";

import { getButtonQueue } from "@/lib/button-queue";
import { createButton, deleteButton, getButtons } from "@/lib/button-service";
import { Button } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface QueryButtonsProps {
  params: {
    username: string;
  };
}
export const queryButtonsAction = async (username: string) => {
  try {
    const buttons: Button[] = await getButtonQueue();
    revalidatePath(`/u/${username}/`);
    return { success: true, buttons };
  } catch (error) {
    console.error("Failed to query buttons:", error);
    return { success: false, error: "Failed to query buttons" };
  }
};
