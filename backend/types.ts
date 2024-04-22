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

export interface ProductType {
    name: string;
    description: string;
    price: number;
    quantity: number;
    image?: string[];
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
