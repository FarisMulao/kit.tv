"use client";

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import React, { useState, useTransition, useRef } from "react";
import { updateStream } from "@/server-actions/stream";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { Hint } from "../hint";
import { Trash } from "lucide-react";
import Image from "next/image";

interface InfoDialogProps {
  initialName: string;
  initialThumbnailUrl: string | null;
}

export function InfoDialog({
  initialName,
  initialThumbnailUrl,
}: InfoDialogProps) {
  const [name, setName] = useState(initialName);
  const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl);
  const [isPending, startTransition] = useTransition();
  const closeRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      updateStream({ name: name, thumbnailUrl: thumbnailUrl })
        .then(() => {
          toast.success("Stream info updated");
          closeRef.current?.click();
        })
        .catch(() => {
          toast.error("Failed to update stream info");
        });
    });
  };

  const onRemove = () => {
    startTransition(() => {
      updateStream({ thumbnailUrl: null })
        .then(() => {
          toast.success("Thumbnail Removed");
          setThumbnailUrl("");
          closeRef.current?.click();
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size={"sm"} className="ml-auto">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Stream Info</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-14">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Stream Name"
              onChange={onChange}
              value={name}
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label>Thumbnail</Label>
            {thumbnailUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                <div className="absolute top-2 right-2 z-10">
                  <Hint label="Remove Thumbnail" asChild side="left">
                    <Button
                      asChild
                      disabled={isPending}
                      onClick={onRemove}
                      className="h-auto p-1.5 w-auto"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </Hint>
                </div>
                <Image
                  src={thumbnailUrl}
                  alt="thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div></div>
            )}
            <div className="">
              <UploadDropzone
                endpoint="thumbnailUploader"
                appearance={{
                  label: {
                    color: "#FFFFFF",
                  },
                  allowedContent: {
                    color: "#FFFFFF",
                  },
                }}
                onClientUploadComplete={(res) => {
                  if (res) {
                    setThumbnailUrl(res[0]?.serverData.fileUrl);
                    router.refresh();
                    closeRef.current?.click();
                  }
                }}
                onUploadError={(err) => {
                  console.error("UploadThing error", err);
                  toast.error("Upload failed.");
                }}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <DialogClose asChild ref={closeRef}>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button variant={"primary"} type="submit" disabled={false}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
