"use client";

import { Button } from "@/components/ui/button";
import { onFollow, onUnfollow } from "@/actions/follow";
import { useTransition } from "react";
import { toast } from "sonner";
import { onBlock, onUnblock } from "@/actions/block";

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

  const handleBlock = () => {
    startTransition(() => {
      onBlock(userId)
        .then((data) =>
          toast.success(`Blocked the user ${data.blocked.username}`)
        )
        .catch(() => toast.error("Something went wrong"));
    });
  };

  const handleUnblock = () => {
    startTransition(() => {
      onUnblock(userId)
        .then((data) =>
          toast.success(`Unblocked the user ${data.blocked.username}`)
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

      <Button
        data-cy={isBlocked ? "unblock-button" : "block-button"}
        disabled={isPending}
        onClick={isBlocked ? handleUnblock : handleBlock}
      >
        {isBlocked ? "Unblock" : "Block"}
      </Button>
    </>
  );
};
