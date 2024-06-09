import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import MobileSidebar from "./sidebar/MobileSidebar";
import { Button } from "./ui/button";
import { ModeToggle } from "./themes/ModeToggle";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { UserNav } from "./User-Nav";
import { REGISTER_ENDPOINT } from "@/constants/endpoints";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
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
            <ModeToggle />
            <MobileSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          </span>

          {/* desktop */}
          {/* <DesktopSidebar /> */}

          <div className="hidden md:flex gap-2">
            {!isAuthenticated ? (
              <>
                <Link to={REGISTER_ENDPOINT}>
                  <Button variant="destructive">Sign Up</Button>
                </Link>
              </>
            ) : (
              <UserNav />
              )}
            <ModeToggle />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
