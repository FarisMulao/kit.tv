"use server";

import { unblockUser } from "@/lib/block-service";
import { revalidatePath } from "next/cache";

export const unblockUserAction = async (id: string) => {
    try {
        await unblockUser(id);
        revalidatePath("/");
        return { success: true, message: "User unblocked successfully" };
    } catch (error) {
        return { success: false, message: "Failed to unblock user" };
    }

}