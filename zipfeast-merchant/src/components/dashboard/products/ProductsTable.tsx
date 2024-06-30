import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/currencyFormatter";
import TablePagination from "../TablePagination";
import { CrudServices } from "@/API/CrudServices";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Product } from "@/types/types";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import DropDownModel from "./DropDownModel";
import AddProductDropDown from "./add/AddProductDropDown";

type ProductsTableProps = {
  products: Product[];
};

const ITEMS_PER_PAGE = 10;

const ProductsTable = ({ products }: ProductsTableProps) => {
  const crudServices = new CrudServices();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
    setPaginatedProducts(
      filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    );
  }, [products, debouncedSearch, currentPage]);

  const handleDeleteProduct = async (productId: string) => {
    setLoading(true);
    try {
      const response = await crudServices.deleteProduct(productId);
      if (response.data.status === "error") {
        toast.error(response.data.message);
      } else {
        toast.success("Product deleted successfully.");
        // After deletion, refetch products or update products state
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setProduct(product);
    setIsOpen(true);
  };

  const handleCreateProduct = () => {
    setIsAddOpen(true);
  };

  return (
    <>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft" disabled>
              Draft
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              className="h-7 gap-1"
              onClick={handleCreateProduct}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Product
              </span>
            </Button>
          </div>
        </div>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your products.</CardDescription>
              <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                  onChange={handleSearch}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">img</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created at
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center font-bold">
                        No products found.
                      </TableCell>
                    </TableRow>
                  )}
                  {paginatedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="hidden sm:table-cell">
                        <img
                          alt={product.name}
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={product.productImage}
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.stock}</Badge>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(parseFloat(product.price))}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(product.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditProduct(product)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={loading}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing{" "}
                <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to{" "}
                <strong>
                  {currentPage * ITEMS_PER_PAGE > products.length
                    ? products.length
                    : currentPage * ITEMS_PER_PAGE}
                </strong>{" "}
                of <strong>{products.length}</strong> products
              </div>
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      {product && (
        <DropDownModel
          isOpen={isOpen}
          title="Edit Product"
          onClose={() => setIsOpen(false)}
          product={product}
        />
      )}
      {
        <AddProductDropDown
          isOpen={isAddOpen}
          title="Add Product"
          onClose={() => setIsAddOpen(false)}
        />
      }
    </>
  );
};

export default ProductsTable;
