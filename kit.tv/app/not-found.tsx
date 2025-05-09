import { Button } from "@/components/ui/button";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="h-full flex flex-col space-y-4 items-center justify-center text-muted-foreground">
      <h1 className="text-3xl font-semibold">404</h1>
      <p>Something went wrong</p>
      <Button variant={"secondary"} asChild>
        <Link href="/" className="text-white">
          Return to home page
        </Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
