"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Hint } from "../hint";
import { Textarea } from "../ui/textarea";
import React, { useState, useTransition, useRef } from "react";
import { toast } from "sonner";
import { updateUser } from "@/server-actions/stream";

interface BioDialogProps {
  initialBio: string | null;
}

export const BioDialog = ({ initialBio }: BioDialogProps) => {
  const [value, setValue] = useState(initialBio || "");
  const [isPending, startTransition] = useTransition();
  const closeRef = useRef<HTMLButtonElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(() => {
      updateUser({ bio: value })
        .then(() => {
          toast.success("Bio updated");
          closeRef.current?.click();
        })
        .catch(() => {
          toast.error("Failed to update bio");
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
          <DialogTitle>Edit Bio</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <Textarea
            placeholder="Your bio"
            value={value}
            disabled={isPending}
            className="resize-none"
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="flex justify-between">
            <DialogClose ref={closeRef} asChild>
              <Button type="button" variant={"ghost"}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant={"primary"} disabled={isPending}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
