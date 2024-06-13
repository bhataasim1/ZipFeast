import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../ui/pagination";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TablePagination = () => {
  return (
    <Pagination className="ml-auto mr-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <Button size="icon" variant="outline" className="h-6 w-6">
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="sr-only">Previous Order</span>
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button size="icon" variant="outline" className="h-6 w-6">
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="sr-only">Next Order</span>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
