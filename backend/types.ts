export type UserProfile = {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
};

export const allowdFileTypes = {
    avatar: ['image/jpeg', 'image/jpg', 'image/png'],
    files: ['application/pdf'],
};
