import { Home, LucideZap, Package, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { MERCHANT_DASHBOARD } from "@/constants/endpoints";

const DashboardNav = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
        <Link
          to={MERCHANT_DASHBOARD}
          className={`group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base ${
            pathname === "/" ? "text-foreground" : ""
          }`}
        >
          <LucideZap className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">ZipFeast Merchant</span>
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/dashboard"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                pathname === "/dashboard"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              } md:h-8 md:w-8`}
            >
              <Home className="h-5 w-5" />
              <span className="sr-only">Dashboard</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Dashboard</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/orders"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                pathname === "/orders"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              } md:h-8 md:w-8`}
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Orders</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Orders</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/products"
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                pathname === "/products"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              } md:h-8 md:w-8`}
            >
              <Package className="h-5 w-5" />
              <span className="sr-only">Products</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Products</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
};

export default DashboardNav;
