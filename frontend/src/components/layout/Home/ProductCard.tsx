import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useShoppingCart } from "@/context/ShoppingCartContext";
import { formatCurrency } from "@/lib/currencyFormatter";
import { ProductType } from "@/types/types";
import { LucideMinus, LucidePlus } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ id, name, price, productImage, stock }: ProductType) => {
  const { getItemQuantity, increaseCartQuantity, decreaseCartQuantity } =
    useShoppingCart();
  const quantity = getItemQuantity(id);
  const stockNumber = Number(stock);

  return (
    <Card className="w-full">
      <CardContent>
        <Link to={`/product/${id}`}>
          <div className="w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5 p-2">
              <div className="w-full h-40">
                <img
                  src={productImage}
                  alt={name}
                  className="rounded-lg w-full h-full "
                  style={{ height: "10rem", objectFit: "contain" }} // Fixed height for consistency
                />
              </div>
            </div>
          </div>
          <div>
            <h5 className="text-sm py-2 text-orange-600 font-medium truncate w-full overflow-ellipsis">
              {name}
            </h5>
            <span className="text-sm font-light">Stock: {stock}</span>
          </div>
          <h3 className="text-sm font-bold py-3">
            {formatCurrency(Number(price))}
          </h3>
        </Link>

        {quantity === 0 ? (
          <Button
            onClick={() => increaseCartQuantity(id)}
            variant={"outline"}
            className="w-full text-red-600 border-2 border-red-600"
            disabled={stockNumber === 0}
          >
            {stockNumber === 0 ? "Out of stock" : "Add to cart"}
          </Button>
        ) : (
          <div className="flex justify-between items-center">
            <Button
              onClick={() => decreaseCartQuantity(id)}
              variant={"outline"}
              className="text-red-600 border-2 border-red-600"
              size={"icon"}
            >
              <LucideMinus size={16} />
            </Button>
            <span className="text-red-600 font-bold">{quantity}</span>
            <Button
              onClick={() => increaseCartQuantity(id)}
              variant={"outline"}
              className="text-red-600 border-2 border-red-600"
              size={"icon"}
              disabled={quantity >= stockNumber}
            >
              <LucidePlus size={16} />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
