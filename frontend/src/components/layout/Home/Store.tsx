import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { ProductType } from "@/types/types";
import { ProductServices } from "@/API/ProductServices";
import { Button } from "@/components/ui/button";

const Store = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const productServices = new ProductServices();

  useEffect(() => {
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchProducts(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchProducts = (page: number) => {
    setLoading(true);
    productServices.getAllProducts(page).then((response) => {
      if (response.data) {
        const newProducts = response.data.data;
        const uniqueProducts = [
          ...products,
          ...newProducts.filter(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            (newProduct) =>
              !products.some((product) => product.id === newProduct.id)
          ),
        ];

        setProducts(uniqueProducts);
        setTotalPages(response.data.meta.totalPages);
      }
      setLoading(false);
    });
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (loading && page === 1) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <div className="container mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-2">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      {page < totalPages && (
        <Button
          className="mt-4 mx-auto block py-2 px-4 rounded"
          onClick={handleLoadMore}
          disabled={loading}
          variant={'outline'}
        >
          {loading ? "Loading..." : "Load More"}
        </Button>
      )}
    </div>
  );
};

export default Store;
