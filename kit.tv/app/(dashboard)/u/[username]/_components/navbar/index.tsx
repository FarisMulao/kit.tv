import { Logo } from "./logo";
import { Actions } from "./actions";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 z-[49] w-full h-20 bg-[#B75D0C] px-2 lg:px-4 flex justify-between items-center shadow-sm">
      <Logo />
      <Actions />
    </nav>
  );
};
