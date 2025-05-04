"use server";

import { createButton, deleteButton } from "@/lib/button-service";
import { Button } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createButtonAction = async (button: Button) => {
  try {
    await createButton({
      ...button,
      id: "",
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to create button:", error);
    return { success: false, error: "Failed to create button" };
  }
}; 

export const deleteButtonAction = async (button: Button) => {
  try {
    await deleteButton(button);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete button:", error);
    return { success: false, error: "Failed to delete button" };
  }
}; 