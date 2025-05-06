import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Actions = async () => {
  const user = await currentUser();

  return (
    <div className="flex gap-x-2 justify-end items-center ml-4 lg:ml-0">
      {!user && (
        <SignInButton>
          <Button size="sm" variant="primary" data-cy="log-in-button">
            Log In
          </Button>
        </SignInButton>
      )}
      {!!user && (
        <div className="flex items-center gap-x-4">
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground"
            asChild
          >
            <Link href={`/u/${user.username}`} data-cy="dashboard-link">
              <span className="hidden lg:block">Creator Dashboard</span>
            </Link>
          </Button>
          <UserButton />
        </div>
      )}
    </div>
  );
};
