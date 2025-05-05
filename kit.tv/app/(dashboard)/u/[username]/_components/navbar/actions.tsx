import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";

export const Actions = () => {
  return (
    <div className="flex gap-x-2 justify-end items-center">
      <Button
        size="sm"
        variant="ghost"
        className="text-muted-foreground hover:text-white"
        asChild
      >
        <Link href="/">
          <LogOut className="h-5 w-5 mr-2" />
          Exit
        </Link>
      </Button>
      <UserButton />
    </div>
  );
};
