import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon } from "lucide-react";
import { BASE_ENDPOINT, REGISTER_ENDPOINT } from "@/constants/endpoints";
import { Nav } from "../Nav";
import { dashboardNavItems, navItems } from "@/constants/navItems";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import useSignOut from "react-auth-kit/hooks/useSignOut";
// import { CrudServices } from "@/API/CrudServices";

export type MobileSidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MobileSidebar({
  isOpen,
  setIsOpen,
}: MobileSidebarProps) {
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  // const crudServices = new CrudServices();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    // await crudServices.logoutUser();
    signOut();
    navigate(BASE_ENDPOINT);
  };
  return (
    <ScrollArea className="h-full">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="px-2">
          <MenuIcon size={"40px"} />
        </SheetTrigger>
        <SheetContent side={"left"} className="!px-0">
          <SheetHeader className="flex justify-center items-center">
            <SheetTitle>
              <Link to={BASE_ENDPOINT}>
                Zip{" "}
                <span className="italic font-bold text-orange-600">Feast</span>
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              {/* <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Navigation
              </h2> */}
              <div className="space-y-1">
                <div className="flex flex-col gap-2 justify-center md:flex-row md:justify-between">
                  {!isAuthenticated ? (
                    <>
                      <Nav items={navItems} setOpen={setIsOpen} mobile />
                      <Link to={REGISTER_ENDPOINT}>
                        <Button variant="destructive" className="w-full">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Nav
                        items={dashboardNavItems}
                        setOpen={setIsOpen}
                        mobile
                      />
                      <Button
                        onClick={handleLogOut}
                        variant="destructive"
                        className="w-full"
                      >
                        LogOut
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </ScrollArea>
  );
}
