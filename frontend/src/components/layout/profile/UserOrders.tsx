import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideTrash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { CrudServices } from "@/API/CrudServices";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// const image = "https://images.unsplash.com/photo-1630563451961-ac2ff27616ab";

const UserOrders = () => {
  const crudService = new CrudServices();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    crudService
      .getUserOrders()
      .then((response) => {
        if (response.data) {
          // eslint-disable-next-line
          //@ts-ignore
          setOrders(response.data.data);
          toast.success("Orders fetched successfully");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error fetching orders", error);
        setLoading(false);
      });
  }, []);

  console.log(orders);

  const cancelOrder = (id: number) => {
    console.log("Order Canceled", id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-3 w-full">
      {orders.length === 0 ? (
        <div className="text-center text-gray-600">No orders found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/*  eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {orders.map((order: any) => (
            <Card key={order.id} className="flex-1">
              <CardContent>
                <Link to={`/product/${order.id}`}>
                  <div className="items-center gap-4">
                    <div className="flex flex-col space-y-1.5 p-2">
                      <div className="w-full h-40">
                        <img
                          src={order.productImage}
                          alt={order.name}
                          className="rounded-lg w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm py-2 font-medium truncate w-full overflow-ellipsis">
                      {order.name}
                    </h5>
                    <span className="text-sm font-light">{order.weight}</span>
                  </div>
                  <h3 className="text-sm font-bold py-3">{order.price}</h3>
                </Link>

                <Button
                  onClick={() => cancelOrder(order.id)}
                  variant={"outline"}
                  className="w-full text-red-600 border-2 border-red-600"
                >
                  <LucideTrash2 size={20} /> Cancel Order
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
