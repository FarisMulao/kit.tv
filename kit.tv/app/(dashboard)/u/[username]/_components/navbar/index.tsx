import { Logo } from "./logo";
import { UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 z-[49] w-full h-20 bg-[#0B0804] px-2 lg:px-4 flex justify-between items-center shadow-sm border-b border-white/20">
      <Logo />
      <p className="text-lg font-semibold mr-20">Streamer View</p>
      <UserButton />
    </nav>
  );
};
