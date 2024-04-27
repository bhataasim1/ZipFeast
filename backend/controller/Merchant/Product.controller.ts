import { Request, Response } from 'express';
import { ApiResponse } from '../../middleware';
import { prisma } from '../../prisma/Schema';
import { InputValidator } from '../../utils/InputValidator';

export class ProductController {
    public async createProduct(req: Request, res: Response) {
        const { name, description, price, stock, category, isAvailable } =
            req.body;
        if (
            !name ||
            !description ||
            !price ||
            !stock ||
            !category ||
            !isAvailable
        ) {
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'All fields are required',
                    },
                    401
                )
            );
        }
        try {
            const productImage = req.file?.filename;
            if (!productImage) {
                return res.send(
                    new ApiResponse({
                        staus: 'error',
                        message: 'Please Upload a Valid Image',
                    })
                );
            }

            ///TODO: Implement the Type Checking here
            const data = {
                name,
                description,
                price,
                category,
                stock,
                productImage,
            };

            const validator = new InputValidator(req);
            validator.validateProduct();

            await validator.validate(req, res, async () => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                const merchantId = req.user?.id;

                const product = await prisma.product.create({
                    data: {
                        ...data,
                        isAvailable: Boolean(isAvailable),
                        merchant: {
                            connect: {
                                id: Number(merchantId),
                            },
                        },
                    },
                });
                return res.send(
                    new ApiResponse(
                        {
                            status: 'success',
                            message: 'Product created successfully',
                            data: product,
                        },
                        201
                    )
                );
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error.message);
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Something went wrong',
                        error,
                    },
                    401
                )
            );
        }
    }

    public async updateProduct(req: Request, res: Response) {
        const { productId } = req.params;
        const { name, description, price, stock, category, isAvailable } =
            req.body;

        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const merchantId = req.user?.id;

            const isProductExist = await prisma.product.findFirst({
                where: {
                    id: Number(productId),
                    merchantId: merchantId,
                },
            });

            if (!isProductExist) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Product not Exists',
                        },
                        404
                    )
                );
            }

            const productImage = req.file?.filename;

            const data = {
                name,
                description,
                price,
                category,
                stock,
                productImage,
            };

            const validator = new InputValidator(req);
            validator.validateProduct();

            ///TODO: i think we need to check the merchant id here like req.user?.id
            await validator.validate(req, res, async () => {
                const product = await prisma.product.update({
                    where: {
                        id: Number(productId),
                    },
                    data: {
                        ...data,
                        isAvailable: Boolean(isAvailable),
                    },
                });
                return res.send(
                    new ApiResponse(
                        {
                            status: 'success',
                            message: 'Product updated successfully',
                            data: product,
                        },
                        201
                    )
                );
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error.message);
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Something went wrong',
                        error,
                    },
                    401
                )
            );
        }
    }

    public async deleteProduct(req: Request, res: Response) {
        try {
            const { productId } = req.params;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const merchantId = req.user?.id;

            const product = await prisma.product.delete({
                where: {
                    id: Number(productId),
                    merchantId: merchantId,
                },
            });

            return res.send(
                new ApiResponse({
                    status: 'success',
                    message: 'Product deleted successfully',
                    data: product,
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
