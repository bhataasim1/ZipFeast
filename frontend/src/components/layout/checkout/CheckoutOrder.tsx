import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BASE_ENDPOINT } from "@/constant/endpoins";
import { useShoppingCart } from "@/context/ShoppingCartContext";
import { formatCurrency } from "@/lib/currencyFormatter";
import { CartItemType } from "@/types/types";
import { LucideMinus, LucidePlus, LucideTrash2 } from "lucide-react";
import { Link } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";
import { Separator } from "@/components/ui/separator";

const CheckoutOrder = () => {
  const {
    cartItems,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    clearCart,
  } = useShoppingCart();

  //   console.log(cartItems);

  const handleClearCart = () => {
    clearCart();
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Checkout Order</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item: CartItemType) => (
                <Card
                  key={item.id}
                  className="flex flex-col md:flex-row items-center justify-between p-4"
                >
                  <div className="flex items-center w-full md:w-auto">
                    <img
                      src={item.product.productImage}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover mr-4 rounded"
                    />
                    <div>
                      <h3 className="text-xl font-semibold">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-500">
                        Price: {formatCurrency(Number(item.product.price))}
                      </p>
                      <div className="flex items-center mt-2">
                        <Button
                          size={"icon"}
                          variant={"destructive"}
                          onClick={() => decreaseCartQuantity(item.id)}
                          disabled={item.quantity <= 1}
                        >
                          <LucideMinus size={20} />
                        </Button>
                        <p className="mx-2 text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                        <Button
                          size={"icon"}
                          variant={"destructive"}
                          onClick={() => increaseCartQuantity(item.id)}
                          disabled={item.quantity >= Number(item.product.stock)}
                        >
                          <LucidePlus size={20} />
                        </Button>
                      </div>
                      <Button
                        size={"icon"}
                        variant={"destructive"}
                        className="mt-2"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <LucideTrash2 size={20} />
                      </Button>
                    </div>
                  </div>
                  <div className="text-lg font-bold mt-4 md:mt-0">
                    {formatCurrency(Number(item.product.price) * item.quantity)}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500">Your cart is empty.</p>
              <Link to={BASE_ENDPOINT}>
                <Button variant={"destructive"} className="mt-4">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
        <div className="col-span-1">
          <Card className="p-4">
            <div className="flex justify-between items-center mt-4">
              <h3 className="text-xl font-semibold">Total:</h3>
              <p className="text-xl font-bold text-orange-600">
                {formatCurrency(
                  cartItems.reduce(
                    (total: number, item: CartItemType) =>
                      total + Number(item.product.price) * item.quantity,
                    0
                  )
                )}
              </p>
            </div>
            <Separator className="my-4" />
            <h3 className="font-semibold mb-4">Shipping Address</h3>
            <CheckoutForm cartItems={cartItems} clearCart={handleClearCart} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutOrder;
