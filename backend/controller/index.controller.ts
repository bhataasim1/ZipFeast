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
        try {
            const products = await prisma.product.findMany({
                include: {
                    merchant: {
                        select: {
                            storeName: true,
                            name: true,
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
}
