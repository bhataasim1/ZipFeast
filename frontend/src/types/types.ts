import { LucideIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

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

export interface SidebarItem extends NavItem {
  onClick?: () => void;
}

export interface NavItemProps {
  item: NavItem;
  index: number;
  mobile: boolean;
  setSidebarOpen?: Dispatch<SetStateAction<boolean>>;
  path: string;
  initialOpen?: boolean;
}

export type ModelFormInputType =
  | "text"
  | "textarea"
  | "email"
  | "password"
  | "number";


  