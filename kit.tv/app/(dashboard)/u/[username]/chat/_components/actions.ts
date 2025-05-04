"use server";

import { createButton } from "@/lib/button-service";
import { Button } from "@prisma/client";

export const createButtonAction = async (button: Button) => {
  try {
    await createButton({
      ...button,
      id: "",
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to create button:", error);
    return { success: false, error: "Failed to create button" };
  }
}; 