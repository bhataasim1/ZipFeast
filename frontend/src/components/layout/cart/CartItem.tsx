import { useShoppingCart } from "@/context/ShoppingCartContext";
import { Products } from "../Home/products";
import { Button } from "@/components/ui/button";
import { LucideTrash2 } from "lucide-react";
import { formatCurrency } from "@/lib/currencyFormatter";

type CartItemProps = {
  id: number;
  quantity: number;
};

const CartItem = ({ id, quantity }: CartItemProps) => {
  const { removeFromCart } = useShoppingCart();
  const item = Products.find((item) => item.id === id);
  if (!item) return null;

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center space-x-4">
        <img
          src={item.image}
          alt={item.name}
          className="rounded-lg w-20 h-20 object-cover"
        />
        <div className="flex flex-col space-y-1.5">
          <h5 className="text-sm font-medium">{item.name}</h5>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Qty: {quantity}</span>
          </div>
          <h3 className="text-sm font-bold">
            {formatCurrency(item.price * quantity)}
          </h3>
        </div>
      </div>
      <Button
        onClick={() => removeFromCart(id)}
        size={"sm"}
        variant={"destructive"}
      >
        <LucideTrash2 size={20} />
      </Button>
    </div>
  );
};

export default CartItem;
