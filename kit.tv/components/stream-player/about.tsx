"use client";

import { BioDialog } from "./bio-dialog";

interface AboutProps {
  hostIdentity: string;
  hostName: string;
  viewerIdentity: string;
  bio: string;
  followedByCount: number;
}

export const About = ({
  hostIdentity,
  hostName,
  viewerIdentity,
  bio,
  followedByCount,
}: AboutProps) => {
  const hostAsViewer = `host-${hostIdentity}`;
  const isHost = viewerIdentity === hostAsViewer;

  const followedByLabel = followedByCount === 1 ? "follower" : "followers";

  return (
    <div className="px-4">
      <div className="rounded-xl group bg-background p-6 lg:p-10 flex flex-col gap-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2 font-semibold text-lg lg:text-xl">
            About {hostName}
          </div>
          {isHost && <BioDialog initialBio={bio} />}
        </div>
        <div className="text-md text-muted-foreground">
          <span className="font-semibold text-primary">{followedByCount}</span>{" "}
          {followedByLabel}
        </div>
        <p className="text-md">{bio || "This user has no bio"}</p>
      </div>
    </div>
  );
};
