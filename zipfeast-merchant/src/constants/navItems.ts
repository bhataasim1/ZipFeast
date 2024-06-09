import { NavItem } from "@/types/types";
import {
  LucideBadgeInfo,
  LucideHome,
  LucideListOrdered,
  LucideUser,
} from "lucide-react";

export const navItems: NavItem[] = [
  {
    name: "Home",
    icon: LucideHome,
    href: "/",
    route: "/",
  },
  {
    name: "About",
    icon: LucideBadgeInfo,
    href: "/about",
    route: "/about",
  },
];

export const dashboardNavItems: NavItem[] = [
  {
    name: "Profile",
    icon: LucideUser,
    href: "/user/profile",
    route: "/user/profile",
  },
  {
    name: "Orders",
    icon: LucideListOrdered,
    href: "/user/orders",
    route: "/user/orders",
  },
];
