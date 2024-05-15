import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const HomeCategoryCard = () => {
  const handleCart = (item: number) => {
    toast.success(`Item ${item} added to cart`);
  };
  return (
    <>
      <h1 className="container font-bold text-2xl mt-3 mb-3">Explore</h1>
      <div className="container mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 30 }).map((_, i) => (
          <Link to={`/product/${i}`} key={i}>
            <Card className="w-full">
              <CardContent>
                <div className="w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5 p-2">
                    <div className="w-full h-40">
                      <img
                        src="https://cdn.zeptonow.com/production///tr:w-350,ar-1021-1021,pr-true,f-auto,q-80/cms/product_variant/d8aeab4b-81fc-4a47-978d-855017898856.jpeg"
                        alt="product"
                        className="rounded-lg w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="text-sm py-2 font-medium">
                    Uncle Chipps - Spicy Treat
                  </h5>
                </div>
                <h3 className="text-sm font-bold py-3">₹128</h3>
                <Button
                  onClick={() => handleCart(i)}
                  variant={"outline"}
                  className="w-full text-red-600 border-2 border-red-600"
                >
                  Add to cart
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
};

export default HomeCategoryCard;
