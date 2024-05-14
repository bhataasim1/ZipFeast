import { NavItem } from "@/types/types"; 
import {
  LucideBadgeInfo,
  LucideBriefcaseBusiness,
  LucideGraduationCap,
  LucideHome,
  LucidePanelBottom,
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
    name: "Dashboard",
    icon: LucidePanelBottom,
    href: "/user/dashboard",
    route: "/user/dashboard",
  },
  {
    name: "Profile",
    icon: LucideUser,
    href: "/user/profile",
    route: "/user/profile",
  },
  {
    name: "Education",
    icon: LucideGraduationCap,
    href: "/user/education",
    route: "/user/education",
  },
  {
    name: "Experience",
    icon: LucideBriefcaseBusiness,
    href: "/user/experience",
    route: "/user/experience",
  },
];