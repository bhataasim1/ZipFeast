import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { ProductType } from "@/types/types";
import { ProductServices } from "@/API/ProductServices";

const Store = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const productServices = new ProductServices();

  useEffect(() => {
    setLoading(true);
    productServices.getAllProducts().then((response) => {
      if (response.data) {
        setProducts(response.data.data.reverse()); //used reverse to show the latest products first
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(products);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="container mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

export default Store;
