import { useEffect, useState } from "react";
import OrderTable from "./OrderTable";
import { CrudServices } from "@/API/CrudServices";

export function DashboardOrders() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const crudServices = new CrudServices();

  // console.log("orders", orders);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await crudServices.getAllOrders();
      // console.log("response", response.data.data);
      if (response.data) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <OrderTable orders={orders} />
        </main>
      </div>
    </div>
  );
}
