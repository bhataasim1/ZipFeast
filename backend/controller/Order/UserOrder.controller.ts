import { Request, Response } from 'express';
import { prisma } from '../../prisma/Schema';
import { ApiResponse } from '../../middleware';
import { OrderServices } from '../services/Order.services';
import { InputValidator } from '../../utils/InputValidator';

const orderServices = new OrderServices();

export class UserOrderController {
    public async getAllUserOrder(req: Request, res: Response) {
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const userId = req.user?.id;
            const userOrders = await prisma.order.findMany({
                where: {
                    userId: userId,
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            if (userOrders.length === 0) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'No user order found',
                        },
                        404
                    )
                );
            }
            return res.send(
                new ApiResponse(
                    {
                        status: 'success',
                        message: 'User order found',
                        data: userOrders,
                    },
                    200
                )
            );
        } catch (error) {
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Error while fetching user order',
                    },
                    500
                )
            );
        }
    }

    public async getUserOrderById(req: Request, res: Response) {
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const userId = req.user?.id;
            const orderId = req.params.orderId;
            const userOrder = await prisma.order.findFirst({
                where: {
                    id: Number(orderId),
                    userId: userId,
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            if (!userOrder) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'No user order found',
                        },
                        404
                    )
                );
            }
            return res.send(
                new ApiResponse(
                    {
                        status: 'success',
                        message: 'User order found',
                        data: userOrder,
                    },
                    200
                )
            );
        } catch (error) {
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Error while fetching user order',
                    },
                    500
                )
            );
        }
    }

    public async createOrder(req: Request, res: Response) {
        try {
            const { cart, deliveryAddress, paymentMethod } = req.body;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const userId = req.user?.id;

            if (!cart || !deliveryAddress || !paymentMethod) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message:
                                'Please provide cart, delivery address, and payment method',
                        },
                        400
                    )
                );
            }

            if (!Array.isArray(cart) || cart.length === 0) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'Cart should be a non-empty array',
                        },
                        400
                    )
                );
            }

            const orderData = {
                userId,
                deliveryAddress,
                paymentMethod,
            };

            // const validator = new InputValidator(req);
            // validator.validateCreateOrder();

            // await validator.validate(req, res, async () => {
                const orders = await Promise.all(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                cart.map(async (cartItem: any) => {
                    const { productId, quantity } = cartItem;
                    const product = await prisma.product.findUnique({
                        where: {
                            id: Number(productId),
                        },
                    });
                    if (!product) {
                        throw new Error(
                            `Product with id ${productId} not found`
                        );
                    }
                    return {
                        productId,
                        quantity,
                        merchantId: product.merchantId,
                    };
                })
            );

            const createdOrders = await Promise.all(
                orders.map(async (order) => {
                    return await orderServices.createOrderService({
                        ...orderData,
                        ...order,
                    });
                })
            );

            return res.send(
                new ApiResponse(
                    {
                        status: 'success',
                        message: 'Orders created successfully',
                        data: createdOrders,
                    },
                    200
                )
            );
            // });
        } catch (error) {
            console.log(error);
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Error while creating orders',
                    },
                    500
                )
            );
        }
    }

    public async cancelOrder(req: Request, res: Response) {
        const orderId = req.params.orderId;

        if (!orderId) {
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Please provide order id',
                    },
                    400
                )
            );
        }

        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const userId = req.user?.id;

            const order = {
                orderId,
                userId,
            };

            const cancelledOrder =
                await orderServices.cancelOrderService(order);

            return res.send(
                new ApiResponse(
                    {
                        status: 'success',
                        message: 'Order cancelled successfully',
                        data: cancelledOrder,
                    },
                    200
                )
            );
        } catch (error) {
            console.log(error);
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Error while cancelling order',
                    },
                    500
                )
            );
        }
    }

    public async updateOrder(req: Request, res: Response) {
        const orderId = req.params.orderId;
        const { deliveryAddress, paymentMethod } = req.body;

        if (!orderId || !deliveryAddress || !paymentMethod) {
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'All fields are required',
                    },
                    400
                )
            );
        }

        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const userId = req.user?.id;

            const orderData = {
                orderId,
                userId,
                deliveryAddress,
                paymentMethod,
            };

            const validator = new InputValidator(req);
            validator.validateOrderUpdate();

            await validator.validate(req, res, async () => {
                const updatedOrder =
                    await orderServices.updateOrderStatusService(orderData);

                return res.send(
                    new ApiResponse(
                        {
                            status: 'success',
                            message: 'Order status updated successfully',
                            data: updatedOrder,
                        },
                        200
                    )
                );
            });
        } catch (error) {
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Error while updating order status',
                    },
                    500
                )
            );
        }
    }
}
