import { useState, useEffect } from "react";
import SearchField from "../layout/search/SearchField";
import ProductList from "../layout/search/ProductList";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/types/types";
import { ProductServices } from "@/API/ProductServices";
import Spinner from "../Spinner"; // Assuming you have a Spinner component for loading

const SearchAndStorePage = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [searchResults, setSearchResults] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState("");
  const productServices = new ProductServices();

  const fetchProducts = async (searchQuery: string) => {
    try {
      setLoading(true);
      const response = await productServices.searchProducts(searchQuery);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsList = async (page: number) => {
    try {
      setLoading(true);
      const response = await productServices.getAllProducts(page);
      if (response.data) {
        const newProducts = response.data.data;
        const uniqueProducts = [
          ...products,
          ...newProducts.filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (newProduct: any) =>
              !products.some((product) => product.id === newProduct.id)
          ),
        ];
        setProducts(uniqueProducts);
        setTotalPages(response.data.meta.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList(1);
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchProductsList(page);
    }
  }, [page]);

  useEffect(() => {
    if (query) {
      fetchProducts(query);
    } else {
      setSearchResults([]);
    }
  }, [query]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const displayedProducts = query ? searchResults : products;

  return (
    <div className="container mt-2">
      <SearchField setQuery={setQuery} query={query} />
      <ProductList products={displayedProducts} loading={loading} />
      {!query && page < totalPages && (
        <Button
          className="mt-4 mx-auto block py-2 px-4 rounded"
          onClick={handleLoadMore}
          disabled={loading}
          variant="outline"
        >
          {loading ? <Spinner /> : "Load More"}
        </Button>
      )}
    </div>
  );
};

export default SearchAndStorePage;
