"use client";

import { useCreatorSidebar } from "@/store/use-creator-sidebar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";

interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  const { collapsed, onCollapse, onExapnd } = useCreatorSidebar(
    (state) => state
  );
  const matches = useMediaQuery(`(max-wdidth: 1024px)`);

  useEffect(() => {
    if (matches) {
      onCollapse();
    } else {
      onExapnd();
    }
  }, [matches, onCollapse, onExapnd]);

  return (
    <div
      className={cn("flex-1", collapsed ? "ml-[70px]" : "ml-[70px] lg:ml-60")}
    >
      {children}
    </div>
  );
};
