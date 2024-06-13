import {
  Home,
  LucideZap,
  Package,
  PanelLeft,
  ShoppingCart,
} from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Link, useLocation } from "react-router-dom";

const DashboardMobileSidebar = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            to="/"
            className={`group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base ${
              pathname === "/" ? "text-foreground" : ""
            }`}
          >
            <LucideZap className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">ZipFeast Merchant</span>
          </Link>
          <Link
            to="/dashboard"
            className={`flex items-center gap-4 px-2.5 ${
              pathname === "/dashboard"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to="/orders"
            className={`flex items-center gap-4 px-2.5 ${
              pathname === "/orders"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            Orders
          </Link>
          <Link
            to="/products"
            className={`flex items-center gap-4 px-2.5 ${
              pathname === "/products"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="h-5 w-5" />
            Products
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default DashboardMobileSidebar;
