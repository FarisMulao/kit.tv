import Image from "next/image";
import { UserAvatar } from "./user-avatar";
import { LiveBadge } from "./live-badge";

interface ThumbnailProps {
  src: string | null;
  fallback: string | null;
  username: string;
  isLive?: boolean;
}

export const Thumbnail = ({
  src,
  fallback,
  username,
  isLive,
}: ThumbnailProps) => {
  let content;

  if (!src) {
    content = (
      <div className="bg-background flex flex-col items-center justify-center gap-y-4 border border-white h-full w-full transition-transform group-hover:translate-x-2 group-hover:-translate-y-2 rounded-md">
        <UserAvatar
          size="lg"
          username={username}
          isLive={isLive}
          imageUrl={fallback ?? ""}
          showBadge
        />
      </div>
    );
  } else {
    content = (
      <Image
        src={src}
        alt=""
        fill
        className="object-cover transition-transform border border-white group-hover:translate-x-2 group-hover:-translate-y-2 rounded-md"
      />
    );
  }

  return (
    <div className="group aspect-video relative rounded-md cursor-pointer">
      <div className="rounded-md absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"></div>
      {content}
      {isLive && src && (
        <div className="absolute top-2 left-2 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
          <LiveBadge />
        </div>
      )}
    </div>
  );
};
