import { LucideIcon } from "lucide-react";

export interface NavItem {
  title?: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: LucideIcon;
  name: string;
  description?: string;
  route: string;
  children?: NavItem[];
}

export type authUserType = {
    id: number;
    name: string;
    email: string;
    avatar: string;
  };