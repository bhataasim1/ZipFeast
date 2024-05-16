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
import { useShoppingCart } from "@/context/ShoppingCartContext";
import { LucideShoppingCart } from "lucide-react";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { openCart, cartQuantity } = useShoppingCart();

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
            <Button
              variant="outline"
              size={"icon"}
              onClick={openCart}
              className="relative"
            >
              <LucideShoppingCart size={25} />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-700 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                  {cartQuantity}
                </span>
              )}
            </Button>
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
            <Button
              variant="outline"
              size={"icon"}
              onClick={openCart}
              className="relative"
            >
              <LucideShoppingCart size={30} />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-700 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                  {cartQuantity}
                </span>
              )}
            </Button>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
