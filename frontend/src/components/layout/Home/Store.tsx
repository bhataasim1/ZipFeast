import ProductCard from "./ProductCard";
import { Products } from "./products";

const Store = () => {
  return (
    <div className="container mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Products.map((item, i) => (
        <div key={i}>
          <ProductCard {...item} />
        </div>
      ))}
    </div>
  );
};

export default Store;
