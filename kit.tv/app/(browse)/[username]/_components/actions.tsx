"use client";

import { Button } from "@/components/ui/button";
import { onFollow, onUnfollow } from "@/server-actions/follow";
import { useTransition } from "react";
import { toast } from "sonner";

interface ActionsProps {
  isFollowing: boolean;
  isBlocked: boolean;
  userId: string;
}

export const Actions = ({ isFollowing, isBlocked, userId }: ActionsProps) => {
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(() => {
      onFollow(userId)
        .then((data) =>
          toast.success(`You are now following ${data.following.username}`)
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const handleUnfollow = () => {
    startTransition(() => {
      onUnfollow(userId)
        .then((data) =>
          toast.success(
            `You are no longer following ${data.following.username}`
          )
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };

  return (
    <>
      <Button
        data-cy={isFollowing ? "unfollow-button" : "follow-button"}
        disabled={isPending}
        variant="primary"
        onClick={isFollowing ? handleUnfollow : handleFollow}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </>
  );
};
