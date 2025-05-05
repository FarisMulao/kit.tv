"use client";

import { cn } from "@/lib/utils";
import { useCreatorSidebar } from "@/store/use-creator-sidebar";

interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper = ({ children }: WrapperProps) => {
  const { collapsed } = useCreatorSidebar((state) => state);

  return (
    <aside
      className={cn(
        "fixed left-0 flex flex-col w-60 h-full bg-[#2B1605] border-r border-[#2B1605] z-50",
        collapsed && "w-[70px]"
      )}
    >
      {children}
    </aside>
  );
};
