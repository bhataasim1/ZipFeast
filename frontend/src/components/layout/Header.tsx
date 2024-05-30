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
import { useShoppingCart } from "@/context/ShoppingCartContext";
import { LucideSearch, LucideShoppingCart } from "lucide-react";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { UserNav } from "./User-Nav";
import { SIGN_IN, SIGN_UP } from "@/constant/endpoins";
// import { Input } from "../ui/input";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { openCart, cartQuantity } = useShoppingCart();
  const isAuthenticated = useIsAuthenticated();

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

          {/* If we need this search then we may require algolia or elastic search */}
          {/* <div className="flex-grow mx-4 max-w-lg">
            <Link to={"/search"}>
              <Input placeholder={`Search for Ch`} className="w-full" />
            </Link>
          </div> */}

          {/* mobile */}
          <span className="flex md:hidden space-x-1">
            <Link to={"/search"}>
              <Button variant={"outline"} size={"icon"}>
                <LucideSearch />
              </Button>
            </Link>
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
            <Link to={"/search"}>
              <Button variant={"outline"} size={"icon"}>
                <LucideSearch />
              </Button>
            </Link>
            <ModeToggle />
            {!isAuthenticated ? (
              <>
                <Link to={SIGN_IN}>
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to={SIGN_UP}>
                  <Button variant="destructive">Sign Up</Button>
                </Link>
              </>
            ) : (
              <UserNav />
            )}
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
