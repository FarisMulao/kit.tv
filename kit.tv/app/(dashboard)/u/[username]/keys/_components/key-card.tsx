"use client";

import { Input } from "@/components/ui/input";
import { CopyButton } from "./copy-button";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface KeyCardProps {
  value: string | null;
}

export const KeyCard = ({ value }: KeyCardProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="rounded-xl bg-muted p-6">
      <div className="flex items-center gap-x-10">
        <p className="font-semibold shrink-0">Stream Key</p>
        <div className="space-y-2 w-full">
          <div className="w-full flex items-center gap-x-2">
            <Input
              value={value || ""}
              type={show ? "text" : "password"}
              disabled
              placeholder="Stream Key"
            />
            <Button
              onClick={() => setShow(!show)}
              variant="link"
              size="sm"
              className="text-white"
            >
              {show ? "Hide" : "Show"}
            </Button>
            <CopyButton value={value || ""} />
          </div>
        </div>
      </div>
    </div>
  );
};
