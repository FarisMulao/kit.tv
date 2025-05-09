"use client";

import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  const matches = useMediaQuery("(max-width: 1024px)");
  const { collapsed, onCollapse, onExapnd } = useSidebar((state) => state);

  useEffect(() => {
    if (matches) {
      onCollapse();
    } else {
      onExapnd();
    }
  }, [matches]);

  return (
    <div
      className={cn(
        "flex-1 bg-stone-900",
        collapsed ? "ml-18" : "ml[70px] lg:ml-60"
      )}
    >
      {children}
    </div>
  );
};
