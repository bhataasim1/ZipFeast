import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import MobileSidebar from "./sidebar/MobileSidebar";
import { Button } from "../ui/button";
import { ModeToggle } from "../themes/ModeToggle";
import FormSearchBox from "../common/FormSearchBox";
import Cart from "./cart/Cart";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          <NavigationMenuItem className="flex justify-center">
            <Link to={"/"}>
              Zip{" "}
              <span className="italic font-bold text-orange-600">Feast</span>
            </Link>
          </NavigationMenuItem>

          <div className="flex-grow mx-4 max-w-lg">
            <FormSearchBox />
          </div>

          {/* mobile */}
          <span className="flex md:hidden space-x-1">
            <ModeToggle />
            <Cart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
            <MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          </span>

          {/* desktop */}
          {/* <DesktopSidebar /> */}

          <div className="hidden md:flex gap-2">
            <ModeToggle />
            <Link to={"/signin"}>
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to={"/signup"}>
              <Button variant="destructive">Sign Up</Button>
            </Link>
            <Cart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
