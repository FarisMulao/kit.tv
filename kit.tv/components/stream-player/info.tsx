"use client";

import { Pencil, Trash } from "lucide-react";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { InfoDialog } from "./info-dialog";
import { Hint } from "../hint";
import { Button } from "../ui/button";

interface InfoProps {
  viewerIdentity: string;
  hostIdentity: string;
  thumbnailUrl: string;
  name: string;
}

export const Info = ({
  viewerIdentity,
  hostIdentity,
  thumbnailUrl,
  name,
}: InfoProps) => {
  const hostAsViewer = `host-${hostIdentity}`;
  const isHost = viewerIdentity === hostAsViewer;

  if (!isHost) return null;

  return (
    <div className="px-4">
      <div className="rounded-xl ">
        <div className="flex items-center gap-x-2.5 p-4">
          <div>
            <h2 className="text-sm lg:text-lg font-semibold capitalize">
              Edit your stream info
            </h2>
          </div>
          <InfoDialog initialName={name} initialThumbnailUrl={thumbnailUrl} />
        </div>
        <Separator />
        <div className="p-4 lg:p-6 space-y-4">
          <div>
            <h3 className="text-sm text-muted-foreground mb-2">Name</h3>
            <p className="text-sm font-semibold">{name}</p>
          </div>
          <div>
            <h3 className="text-sm text-muted-foreground mb-2">Thumbnail</h3>

            {thumbnailUrl && (
              <div className="relative aspect-video rounded-md overflow-hidden w-[200px] border-white/10">
                <Image
                  fill
                  src={thumbnailUrl}
                  alt={name}
                  className="object-cover"
                />
              </div>
            )}
            {(thumbnailUrl === null || thumbnailUrl === "") && (
              <div className="relative aspect-video rounded-md overflow-hidden w-[200px] border border-white/10"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
