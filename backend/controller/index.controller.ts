import { Request, Response } from 'express';
import { ApiResponse } from '../middleware';
import { prisma } from '../prisma/Schema';

export class IndexController {
    public async getMerchants(req: Request, res: Response) {
        const merchant = await prisma.merchant.findMany({
            select: {
                name: true,
                storeName: true,
                email: true,
                products: true,
            },
        });

        return res.send(
            new ApiResponse(
                {
                    status: 'success',
                    message: 'Merchant fetched successfully',
                    merchant,
                },
                200
            )
        );
    }

    public async getMerchantByName(req: Request, res: Response) {
        ///TODO: Implement the Type Checking here
        const { storeName } = req.params;
        const merchant = await prisma.merchant.findUnique({
            where: {
                storeName,
            },
            select: {
                name: true,
                storeName: true,
                email: true,
                products: true,
            },
        });
        if (!merchant) {
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Merchant not found',
                    },
                    404
                )
            );
        }

        return res.send(
            new ApiResponse(
                {
                    status: 'success',
                    message: 'Merchant fetched successfully',
                    merchant,
                },
                200
            )
        );
    }

    public async getProducts(req: Request, res: Response) {
        const { page = 1, limit = 20 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        try {
            const products = await prisma.product.findMany({
                orderBy: {
                    createdAt: 'desc',
                },
                skip: skip,
                take: Number(limit),
                include: {
                    merchant: {
                        select: {
                            storeName: true,
                            name: true,
                            address: true,
                            email: true,
                        },
                    },
                },
            });

            const totalProducts = await prisma.product.count();

            return res.send(
                new ApiResponse({
                    status: 'success',
                    data: products,
                    meta: {
                        total: totalProducts,
                        page: Number(page),
                        limit: Number(limit),
                        totalPages: Math.ceil(totalProducts / Number(limit)),
                    },
                })
            );
        } catch (error) {
            return res.send(
                new ApiResponse({
                    status: 'error',
                    message: 'Something went wrong',
                    error,
                })
            );
        }
    }

    public async getProductById(req: Request, res: Response) {
        const { productId } = req.params;
        const product = await prisma.product.findUnique({
            where: {
                id: Number(productId),
            },
            include: {
                merchant: {
                    select: {
                        storeName: true,
                        name: true,
                        address: true,
                        email: true,
                    },
                },
            },
        });

        if (!product) {
            return res.send(
                new ApiResponse({
                    status: 'error',
                    message: 'Product not found',
                })
            );
        }

        return res.send(
            new ApiResponse({
                status: 'success',
                data: product,
            })
        );
    }

    public async searchProducts(req: Request, res: Response) {
        const { q } = req.query;
        try {
            const products = await prisma.product.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: String(q),
                            },
                        },
                        {
                            description: {
                                contains: String(q),
                            },
                        },
                        {
                            category: {
                                contains: String(q),
                            },
                        },
                    ],
                },
                include: {
                    merchant: {
                        select: {
                            storeName: true,
                            name: true,
                            address: true,
                            email: true,
                        },
                    },
                },
            });

            return res.send(
                new ApiResponse({
                    status: 'success',
                    data: products,
                })
            );
        } catch (error) {
            return res.send(
                new ApiResponse({
                    status: 'error',
                    message: 'Something went wrong',
                    error,
                })
            );
        }
    }

    public async getCategories(req: Request, res: Response) {
        const categories = await prisma.product.findMany({
            select: {
                category: true,
            },
        });

        const uniqueCategories = Array.from(
            new Set(categories.map((category) => category.category))
        );

        return res.send(
            new ApiResponse({
                status: 'success',
                data: uniqueCategories,
            })
        );
    }

    public async getAllServiceProviders(req: Request, res: Response) {
        try {
            const serviceProviders = await prisma.serviceProvider.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    serviceType: true,
                    address: true,
                    city: true,
                    state: true,
                    pincode: true,
                    avatar: true,
                    price: true,
                },
            });

            return res.send(
                new ApiResponse({
                    status: 'success',
                    data: serviceProviders,
                })
            );
        } catch (error) {
            return res.send(
                new ApiResponse({
                    status: 'error',
                    message: 'Something went wrong',
                    error,
                })
            );
        }
    }

    public async getServiceProviderById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const serviceProvider = await prisma.serviceProvider.findUnique({
                where: {
                    id: Number(id),
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    serviceType: true,
                    address: true,
                    city: true,
                    state: true,
                    pincode: true,
                    avatar: true,
                    price: true,
                },
            });

            if (!serviceProvider) {
                return res.send(
                    new ApiResponse({
                        status: 'error',
                        message: 'Service Provider not found',
                    })
                );
            }

            return res.send(
                new ApiResponse({
                    status: 'success',
                    data: serviceProvider,
                })
            );
        } catch (error) {
            return res.send(
                new ApiResponse({
                    status: 'error',
                    message: 'Something went wrong',
                    error,
                })
            );
        }
    }
}
