import { useShoppingCart } from "@/context/ShoppingCartContext";
import { Button } from "@/components/ui/button";
import { LucideTrash2 } from "lucide-react";
import { formatCurrency } from "@/lib/currencyFormatter";
import { ProductType } from "@/types/types";

type CartItemProps = {
  id: number;
  quantity: number;
  product: ProductType; // Include the product details
};

const CartItem = ({ id, quantity, product }: CartItemProps) => {
  const { removeFromCart } = useShoppingCart();

  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center space-x-4">
        <img
          src={product.productImage}
          alt={product.name}
          className="rounded-lg w-20 h-20 object-cover"
        />
        <div className="flex flex-col space-y-1.5">
          <h5 className="text-sm font-medium">{product.name}</h5>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Qty: {quantity}</span>
          </div>
          <h3 className="text-sm font-bold">
            {formatCurrency(Number(product.price) * quantity)}
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
