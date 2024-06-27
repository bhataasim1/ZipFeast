import { useState, useEffect } from "react";
import { ListFilter, MoreHorizontal, Search } from "lucide-react";
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { formatCurrency } from "@/lib/currencyFormatter";
import { Order } from "@/types/types";
import TablePagination from "../TablePagination";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import DropDownModel from "./DropDownModel";

type OrderTableProps = {
  orders: Order[];
};

const ITEMS_PER_PAGE = 10;

const OrderTable = ({ orders }: OrderTableProps) => {
  const [filters, setFilters] = useState<{ [key: string]: boolean }>({
    pending: true,
    delivered: true,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Order[]>(orders);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const results = orders.filter((order) =>
      matchesSearch(order, debouncedSearch)
    );
    setSearchResults(results);
  }, [debouncedSearch, orders]);

  const matchesSearch = (order: Order, searchTerm: string): boolean => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    if (order.user.name.toLowerCase().includes(normalizedSearch)) {
      return true;
    }
    if (order.deliveryAddress.toLowerCase().includes(normalizedSearch)) {
      return true;
    }
    if (
      order.items[0]?.product?.name.toLowerCase().includes(normalizedSearch)
    ) {
      return true;
    }
    return false;
  };

  const toggleFilter = (filterName: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  const filteredOrders = searchResults.filter((order) => {
    if (filters.pending && order.orderStatus === "PENDING") return true;
    if (filters.delivered && order.orderStatus === "DELIVERED") return true;
    return false;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOrderStatus = (order: Order) => () => {
    setSelectedOrder(order);
    setIsOpen(true);
  };

  return (
    <>
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filters.pending}
                onCheckedChange={() => toggleFilter("pending")}
              >
                Pending
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.delivered}
                onCheckedChange={() => toggleFilter("delivered")}
              >
                Delivered
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage your Orders.</CardDescription>
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
                <TableHead>Customer Name</TableHead>
                <TableHead>Customer Email</TableHead>
                <TableHead>Customer Phone</TableHead>
                <TableHead>Customer Address</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center font-bold">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
              {paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="hidden sm:table-cell">
                    <img
                      alt="Product img"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={order.items[0].product.productImage}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {order.user.name}
                  </TableCell>
                  <TableCell>{order.user.email}</TableCell>
                  <TableCell>{order.user.phone}</TableCell>
                  <TableCell>{order.deliveryAddress}</TableCell>
                  <TableCell>{order.items[0]?.product?.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.orderStatus}</Badge>
                  </TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">
                      {formatCurrency(order.totalAmount)}
                    </Badge>
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
                        <DropdownMenuItem onClick={handleOrderStatus(order)}>
                          Update Order Status
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
            Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> to{" "}
            <strong>
              {currentPage * ITEMS_PER_PAGE > filteredOrders.length
                ? filteredOrders.length
                : currentPage * ITEMS_PER_PAGE}
            </strong>{" "}
            of <strong>{filteredOrders.length}</strong> orders
          </div>
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </CardFooter>
      </Card>
      {selectedOrder && (
        <DropDownModel
          isOpen={isOpen}
          title="Update Order Status"
          onClose={() => setIsOpen(false)}
          order={selectedOrder}
        />
      )}
    </>
  );
};

export default OrderTable;
