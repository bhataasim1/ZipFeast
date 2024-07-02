import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideEdit2, LucideTrash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CrudServices } from "@/API/CrudServices";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UpdateOrder from "./UpdateOrder";
import { formatCurrency } from "@/lib/currencyFormatter";

const UserOrders = () => {
  const crudService = new CrudServices();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    crudService
      .getUserOrders()
      .then((response) => {
        if (response.data) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          setOrders(response.data.data.reverse());
          toast.success("Orders fetched successfully");
        }
        setLoading(false);
      })
      .catch((error) => {
        // console.log(error);
        toast.error("Error fetching orders", error);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelOrder = (id: number) => {
    crudService
      .cancelOrder(id)
      .then((response) => {
        if (response.data) {
          toast.success("Order cancelled successfully");
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setOrders(orders.filter((order: any) => order.id !== id));
        }
      })
      .catch((error) => {
        // console.log(error);
        toast.error("Error cancelling order", error);
      });
  };

  const buyAgain = (id: number) => {
    navigate(`/product/${id}`);
  };

  const filteredOrders =
    filterStatus === "ALL"
      ? orders
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        orders.filter((order: any) => order.orderStatus === filterStatus);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleupdateOrder = (order: any) => {
    setUpdatingOrder(order);
  };

  const closeUpdateOrder = () => {
    setUpdatingOrder(null);
  };

  if (updatingOrder) {
    return <UpdateOrder order={updatingOrder} close={closeUpdateOrder} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-3 w-full">
      <div className="flex justify-center mb-4 gap-2">
        <Button
          onClick={() => setFilterStatus("ALL")}
          variant={filterStatus === "ALL" ? "destructive" : "outline"}
        >
          All Orders
        </Button>
        <Button
          onClick={() => setFilterStatus("PENDING")}
          variant={filterStatus === "PENDING" ? "destructive" : "outline"}
        >
          Pending
        </Button>
        <Button
          onClick={() => setFilterStatus("DELIVERED")}
          variant={filterStatus === "DELIVERED" ? "destructive" : "outline"}
        >
          Delivered
        </Button>
      </div>
      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-600">No orders found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {filteredOrders.map((order: any) => (
            <Card key={order.id} className="flex-1">
              <CardContent>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {order.items.map((item: any) => (
                  <Link to={`/product/${item.product.id}`} key={item.id}>
                    <div className="items-center gap-4">
                      <div className="flex flex-col space-y-1.5 p-2">
                        <div className="w-full h-40">
                          <img
                            src={item.product.productImage}
                            alt={item.product.name}
                            className="rounded-lg w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm py-2 font-medium truncate w-full overflow-ellipsis">
                          {item.product.name}
                        </h5>
                        <span className="text-sm font-light overflow-ellipsis">
                          Qunatity: {order.totalQuantity} x{" "}
                          {formatCurrency(item.product.price)}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold py-3">
                        {formatCurrency(order.totalAmount)}
                      </h3>
                    </div>
                  </Link>
                ))}
                {order.orderStatus === "DELIVERED" ? (
                  <Button
                    onClick={() => buyAgain(order.id)}
                    variant={"outline"}
                    className="w-full text-green-600 border-2 border-green-600"
                  >
                    Buy Again
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => cancelOrder(order.id)}
                      variant={"outline"}
                      className="w-1/2 text-red-600 border-2 border-red-600"
                    >
                      <LucideTrash2 size={20} /> Cancel Order
                    </Button>

                    <Button
                      onClick={() => handleupdateOrder(order)}
                      variant={"outline"}
                      className="w-1/2 text-green-600 border-2 border-green-600"
                    >
                      <LucideEdit2 size={20} /> Update Order
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
