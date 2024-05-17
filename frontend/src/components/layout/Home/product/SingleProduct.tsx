import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useShoppingCart } from "@/context/ShoppingCartContext";
import { LucideMinus, LucidePlus } from "lucide-react";

export const SingleProduct = () => {
  const { id } = useParams();

  const { increaseCartQuantity, decreaseCartQuantity, getItemQuantity } =
    useShoppingCart();
  const quantity = getItemQuantity(Number(id));

  return (
    <div className="container mx-auto my-5 px-4">
      <div className="flex flex-col lg:flex-row">
        <Card className="lg:w-1/2 mb-4 lg:mb-0 lg:mr-4">
          <CardContent>
            <div className="h-full mt-3">
              <img
                src="https://images.unsplash.com/photo-1567306301408-9b74779a11af"
                alt="product"
                className="rounded-lg w-full object-cover h-full"
              />
            </div>
          </CardContent>
        </Card>
        <div className="flex flex-col lg:w-1/2">
          <div className="mb-4">
            <h5 className="text-2xl font-bold truncate w-full overflow-ellipsis">
              Product Name {id}
            </h5>
            <span className="text-lg font-light">Weight: 1L</span>
            <h3 className="text-2xl font-bold py-3">₹54</h3>
            <p className="text-muted-foreground">
              This is a description of the product. It includes details about
              the product and its features.
            </p>
            <div className="flex mt-3">
              {quantity === 0 ? (
                <Button
                  onClick={() => increaseCartQuantity(Number(id))}
                  variant={"outline"}
                  className="text-red-600 border-2 border-red-600"
                >
                  Add to cart
                </Button>
              ) : (
                <div className="flex justify-between items-center space-x-5">
                  <Button
                    onClick={() => decreaseCartQuantity(Number(id))}
                    variant={"outline"}
                    className="text-red-600 border-2 border-red-600"
                    size={"icon"}
                  >
                    <LucideMinus size={16} />
                  </Button>
                  <span className="text-red-600 font-bold">{quantity}</span>
                  <Button
                    onClick={() => increaseCartQuantity(Number(id))}
                    variant={"outline"}
                    className="text-red-600 border-2 border-red-600"
                    size={"icon"}
                  >
                    <LucidePlus size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
