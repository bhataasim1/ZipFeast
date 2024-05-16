import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useSearchParams } from "react-router-dom";
import { BASE_ENDPOINT } from "@/constant/endpoins";
import { useEffect } from "react";
import { useShoppingCart } from "@/context/ShoppingCartContext";
import CartItem from "./CartItem";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currencyFormatter";
import { Products } from "../Home/products";

export type ShoppingCartProps = {
  isCartOpen: boolean;
};

export default function ShoppingCart({ isCartOpen }: ShoppingCartProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { closeCart, cartItems } = useShoppingCart();

  useEffect(() => {
    if (isCartOpen) {
      searchParams.set("cart", "open");
    } else {
      searchParams.delete("cart");
    }
    setSearchParams(searchParams);
  }, [isCartOpen, searchParams, setSearchParams]);

  const totalPrice = cartItems.reduce((total, cartItem) => {
    const item = Products.find((product) => product.id === cartItem.id);
    if (item) {
      total += item.price * cartItem.quantity;
    }
    return total;
  }, 0);

  return (
    <ScrollArea className="h-full">
      <Sheet open={isCartOpen} onOpenChange={closeCart}>
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
            {cartItems.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <h3 className="text-lg font-bold">Cart is empty</h3>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <CartItem key={item.id} {...item} />
                ))}
                <div className="flex justify-end items-end p-4">
                  <h3 className="text-sm font-bold">
                    Total: {formatCurrency(totalPrice)}
                  </h3>
                </div>
                <Button
                  variant="destructive"
                  className="w-full"
                  // onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </ScrollArea>
  );
}
