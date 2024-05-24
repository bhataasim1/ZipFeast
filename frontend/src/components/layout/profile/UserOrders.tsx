import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideTrash2 } from "lucide-react";
import { Link } from "react-router-dom";

const image = "https://images.unsplash.com/photo-1630563451961-ac2ff27616ab";

const UserOrders = () => {
  const cancelOrder = (id: number) => {
    console.log("Order Canceled", id);
  };
  return (
    <div className="p-3 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card key={index} className="flex-1">
            <CardContent>
              <Link to={`/product/${index + 1}`}>
                <div className="items-center gap-4">
                  <div className="flex flex-col space-y-1.5 p-2">
                    <div className="w-full h-40">
                      <img
                        src={image}
                        alt={"name"}
                        className="rounded-lg w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className="text-sm py-2 font-medium truncate w-full overflow-ellipsis">
                    Apple
                  </h5>
                  <span className="text-sm font-light">120g</span>
                </div>
                <h3 className="text-sm font-bold py-3">100rs</h3>
              </Link>

              <Button
                onClick={() => cancelOrder(index)}
                variant={"outline"}
                className="w-full text-red-600 border-2 border-red-600"
              >
                <LucideTrash2 size={20} /> Cancel Order
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserOrders;
