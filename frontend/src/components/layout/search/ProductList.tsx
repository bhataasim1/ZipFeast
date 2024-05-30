import ProductCard from "@/components/layout/Home/ProductCard";
import Spinner from "@/components/Spinner";
import { ProductType } from "@/types/types";

type ProductListProps = {
  products: ProductType[];
  loading: boolean;
};

const ProductList = ({ products, loading }: ProductListProps) => {
  if (loading) {
    return <Spinner />;
  }

  if (products.length === 0) {
    return <h1 className="font-bold flex justify-center items-center">No products found</h1>;
  }

  return (
    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ProductList;
