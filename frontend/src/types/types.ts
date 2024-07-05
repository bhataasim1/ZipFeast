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

export type authUserType = {
  id: number;
  name: string;
  email: string;
  avatar: string;
  serviceType?: string;
};

export type MerchantType = {
  storeName: string;
  name: string;
  address: string;
  email: string;
};

export type ProductType = {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  productImage: string;
  merchantId: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  merchant: MerchantType;
};

export type CartItemType = {
  id: number;
  product: ProductType;
  quantity: number;
};

export type ServiceProviderType = {
  id: number;
  email: string;
  name: string;
  phone: string;
  address: string;
  avatar: string;
  city: string;
  pincode: string;
  serviceType: string;
  state: string;
  price: string;
};
