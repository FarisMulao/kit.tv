import { LiveBadge } from "@/components/live-badge";
import { Thumbnail } from "@/components/thumbnail";
import { UserAvatar } from "@/components/user-avatar";
import { Stream, User } from "@prisma/client";
import Link from "next/link";

interface StreamCardProps {
  data: {
    user: User;
    thumbnailUrl: string | null;
    name: string;
    isLive: boolean;
  };
}

export const StreamCard = ({ data }: StreamCardProps) => {
  return (
    <Link href={`/${data.user.username}`}>
      <div className="h-full w-full space-y-4" data-cy={`stream-card-${data.user.username}`}>
        <Thumbnail
          src={data.thumbnailUrl}
          fallback={data.user.imageUrl}
          isLive={data.isLive}
          username={data.user.username}
        />

        <div className="flex gap-x-3">
          <UserAvatar
            imageUrl={data.user.imageUrl}
            username={data.user.username}
            isLive={data.isLive}
          />
          <div className="flex-1">
            <p className="font-semibold truncate">{data.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              {data.user.username}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
