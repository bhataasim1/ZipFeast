import { ProductType } from './product.types';

export type BaseInputType = {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
};

enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export interface UserProfileType extends BaseInputType {
    name: string;
    email: string;
    password: string;
    role: Role;
    avatar?: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
}

export interface MerchantProfileType extends BaseInputType {
    storeName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    avatar?: string;
    products?: ProductType[];
}

export type PayloadType = {
    id: number | string;
    email: string;
    role?: string | number;
};
export const allowdFileTypes = {
    avatar: ['image/jpeg', 'image/jpg', 'image/png'],
    files: ['application/pdf'],
};


export type OrderDataTypes = {
    userId: number;
    merchantId: number;
    productId: number | string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    quantity: any;   //Need to fix this one it could be number | string
    deliveryAddress: string;
    paymentMethod: string;
};