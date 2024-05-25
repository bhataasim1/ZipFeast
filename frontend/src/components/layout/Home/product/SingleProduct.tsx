import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useShoppingCart } from "@/context/ShoppingCartContext";
import { LucideMinus, LucidePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductType } from "@/types/types";
import { ProductServices } from "@/API/ProductServices";
import { formatCurrency } from "@/lib/currencyFormatter";

export const SingleProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(false);
  const productServices = new ProductServices();

  useEffect(() => {
    if (id) {
      setLoading(true);
      productServices
        .getProductById(Number(id))
        .then((response) => {
          if (response.data) {
            setProduct(response.data.data);
          }
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const { increaseCartQuantity, decreaseCartQuantity, getItemQuantity } =
    useShoppingCart();
  const quantity = getItemQuantity(Number(id));

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="container mx-auto my-5 px-4">
      {product && (
        <div className="flex flex-col lg:flex-row">
          <Card className="lg:w-[30%] mb-4 lg:mb-0 lg:mr-4">
            <CardContent>
              <div className="h-full w-full mt-3">
                <img
                  src={product.productImage}
                  alt={product.name}
                  className="rounded-lg w-full h-full "
                  style={{ height: "24rem", objectFit: 'contain' }} // Fixed height
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col lg:w-1/2">
            <div className="mb-4">
              <h5 className="text-2xl font-bold truncate w-full overflow-ellipsis">
                {product.name}
              </h5>
              <span className="text-lg font-light">Stock: {product.stock}</span>
              <h3 className="text-2xl font-bold py-3">
                {formatCurrency(Number(product.price))}
              </h3>
              <p className="text-muted-foreground">{product.description}</p>
              <div className="flex mt-3">
                {quantity === 0 ? (
                  <Button
                    onClick={() => increaseCartQuantity(Number(id))}
                    variant={"outline"}
                    className="text-red-600 border-2 border-red-600"
                    disabled={Number(product.stock) === 0}
                  >
                    {Number(product.stock) === 0
                      ? "Out of stock"
                      : "Add to cart"}
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
                      disabled={quantity >= Number(product.stock)}
                    >
                      <LucidePlus size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
