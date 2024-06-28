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

export type Product = {
  id: string;
  name: string;
  price: string;
  productImage: string;
  stock: string;
  category: string;
  isAvailable: boolean;
  merchantId: string;
  createdAt: string;
  description: string;
  updatedAt: string;
};

export type OrderItem = {
  quantity: number;
  product: Product;
};

export type Order = {
  id: number;
  createdAt: string;
  updatedAt: string;
  deliveryAddress: string;
  merchantId: number;
  orderStatus: string;
  paymentMethod: string;
  totalAmount: number;
  totalQuantity: number;
  items: OrderItem[];
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  userId: number;
};
