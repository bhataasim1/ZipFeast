import { useEffect, useState } from "react";
import ProductsTable from "./ProductsTable";
import { CrudServices } from "@/API/CrudServices";

export function DashboardProducts() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const crudServices = new CrudServices();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await crudServices.getAllProducts();
      // console.log("Products response:", response.data);
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <ProductsTable products={products} />
        </main>
      </div>
    </div>
  );
}
