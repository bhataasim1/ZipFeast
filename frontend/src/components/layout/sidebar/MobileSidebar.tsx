import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MenuIcon } from "lucide-react";
import { BASE_ENDPOINT, SIGN_IN, SIGN_UP } from "@/constant/endpoins";
import { Nav } from "../Nav";
import { navItems } from "@/constant/navItems";

export type MobileSidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MobileSidebar({
  isOpen,
  setIsOpen,
}: MobileSidebarProps) {
  return (
    <ScrollArea className="h-full">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="px-2">
          <MenuIcon size={"36px"} />
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
                <Nav items={navItems} setOpen={setIsOpen} mobile />
                <div className="flex flex-col gap-2 justify-center md:flex-row md:justify-between">
                  <Link to={SIGN_IN}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to={SIGN_UP}>
                    <Button variant="destructive" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </ScrollArea>
  );
}
