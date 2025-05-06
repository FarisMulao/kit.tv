"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { unblockUserAction } from "../actions";

const BlockedUserCard = ({ user }: { user: { blocked: { id: string; username: string } } }) => {
    const handleUnblock = async () => {
        try {
            await unblockUserAction(user.blocked.id);
            toast.success(`Unblocked ${user.blocked.username}`); 
        } catch (error) {
            toast.error("Failed to unblock user");
        }
    };

    return (
        <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
            <div className="flex items-center gap-x-4">
                <div className="text-lg font-semibold">
                    {user.blocked.username}
                </div>
            </div>
            <Button
                onClick={handleUnblock}
                variant="primary"
                size="sm"
            >
                Unblock
            </Button>
        </div>
    );
};

export default BlockedUserCard;