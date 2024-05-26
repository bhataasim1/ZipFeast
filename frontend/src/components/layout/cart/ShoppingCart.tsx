import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { BASE_ENDPOINT, SIGN_IN } from "@/constant/endpoins";
import { useEffect } from "react";
import { useShoppingCart } from "@/context/ShoppingCartContext";
import CartItem from "./CartItem";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currencyFormatter";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { authUserType } from "@/types/types";

export type ShoppingCartProps = {
  isCartOpen: boolean;
};

export default function ShoppingCart({ isCartOpen }: ShoppingCartProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { closeCart, cartItems } = useShoppingCart();
  const navigate = useNavigate();

  const authUser: authUserType | null = useAuthUser();

  useEffect(() => {
    if (isCartOpen) {
      searchParams.set("cart", "open");
    } else {
      searchParams.delete("cart");
    }
    setSearchParams(searchParams);
  }, [isCartOpen, searchParams, setSearchParams]);

  const totalPrice = cartItems.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  const handleCheckout = () => {
    navigate("/checkout");
    closeCart();
  }

  return (
    <ScrollArea className="h-full overflow-y-auto">
      <Sheet open={isCartOpen} onOpenChange={closeCart}>
        <SheetContent side={"right"} className="!px-0 overflow-y-auto">
          <SheetHeader className="flex justify-center items-center">
            <SheetTitle>
              <Link to={BASE_ENDPOINT}>
                Zip{" "}
                <span className="italic font-bold text-orange-600">Feast</span>
              </Link>
            </SheetTitle>
          </SheetHeader>
          {!authUser ? (
            <div className="flex flex-col items-center justify-center space-y-4 p-4">
              <p className="text-center text-sm text-muted-foreground">
                You need to be logged in to view your cart
              </p>
              <Link to={SIGN_IN}>
                <Button
                  variant={"destructive"}
                  className="w-full"
                  onClick={closeCart}
                >
                  Sign in
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-4 p-4 mt-[50%]">
                  <p className="text-center text-sm text-muted-foreground">
                    Your cart is empty
                  </p>
                  <Link to={BASE_ENDPOINT}>
                    <Button
                      variant={"destructive"}
                      className="w-full"
                      onClick={closeCart}
                    >
                      Continue shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col space-y-4 p-4">
                  {cartItems.map((cartItem) => (
                    <CartItem key={cartItem.id} {...cartItem} />
                  ))}
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-sm font-bold">
                      {formatCurrency(totalPrice)}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Button variant="destructive" className="w-full" onClick={handleCheckout}>
                      Checkout
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </ScrollArea>
  );
}
