import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { LucideShoppingCart } from "lucide-react";
import { BASE_ENDPOINT } from "@/constant/endpoins";
import { useEffect } from "react";

export type CartProps = {
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Cart({ isCartOpen, setIsCartOpen }: CartProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (isCartOpen) {
      searchParams.set("cart", "open");
    } else {
      searchParams.delete("cart");
    }
    setSearchParams(searchParams);
  }, [isCartOpen, searchParams, setSearchParams]);

  return (
    <ScrollArea className="h-full">
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetTrigger asChild className="px-2 cursor-pointer">
          <LucideShoppingCart size={40} />
        </SheetTrigger>
        <SheetContent side={"right"} className="!px-0">
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
              <div className="space-y-1">
                <div className="flex flex-col gap-2 justify-center md:flex-row md:justify-between">
                  <Button variant="outline" size="sm">
                    Need to implement this
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </ScrollArea>
  );
}
