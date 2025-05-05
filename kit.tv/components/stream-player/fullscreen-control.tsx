"use client";

import { Maximize, Minimize } from "lucide-react";
import { Hint } from "@/components/hint";

interface FullscreenControlProps {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export const FullscreenControl = ({
  isFullscreen,
  toggleFullscreen,
}: FullscreenControlProps) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <Hint
        label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        side="right"
        asChild
      >
        <button className="h-auto p-2" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize /> : <Maximize />}
        </button>
      </Hint>
    </div>
  );
};
