"use server";

import { createButton, deleteButton } from "@/lib/button-service";
import { getSounds } from "@/lib/sound-service";
import { Button, Sound } from "@prisma/client";
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

export const getSoundsAction = async () => {
  try {
    const sounds: Sound[] = await getSounds();
    return { success: true, sounds };
  } catch (error) {
    console.error("Failed to get sounds:", error);
    return { success: false, error: "Failed to get sounds" };
  }
};
