export interface ProductType {
    name: string;
    description: string;
    price: string;
    category: string;
    merchantId: number;
    order?: string[];
    isAvailable: boolean;
    productImage: string;
    stock: string;
}
