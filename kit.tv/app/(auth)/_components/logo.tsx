import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const Logo = () => {
  return (
    <div className="flex flex-col item-center gap-y-4">
      <div className="bg-blue-300 rounded-full p-1">
        <Image src="/kitcat.svg" alt="kit.tv" height="80" width="80" />
      </div>
      <div className={cn("flex flex-col items-center", font.className)}>
        <p className="text-xl font-semibold">Kit.tv</p>
      </div>
    </div>
  );
};
