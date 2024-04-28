import { Request, Response } from 'express';
import { ApiResponse } from '../../middleware';
import { MerchantOrderService } from '../services/MerchantOrder.services';

const merchantOrderService = new MerchantOrderService();

export class MerchantOrderController {
    public async getMerchantOrders(req: Request, res: Response) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const merchantId = req.user?.id;
        try {
            const merchantOrders =
                await merchantOrderService.getMerchantOrders(merchantId);

            if (merchantOrders.length === 0) {
                return res.send(
                    new ApiResponse(
                        {
                            status: 'error',
                            message: 'No merchant order found',
                        },
                        404
                    )
                );
            }
            return res.send(
                new ApiResponse(
                    {
                        status: 'success',
                        message: 'Merchant order found',
                        data: merchantOrders,
                    },
                    200
                )
            );
        } catch (error) {
            return res.send(
                new ApiResponse(
                    {
                        status: 'error',
                        message: 'Error while fetching merchant order',
                    },
                    500
                )
            );
        }
    }

    public async updateOrderStatus(req: Request, res: Response) {
        const orderId = req.params.orderId;
        const { orderStatus }: { orderStatus: string } = req.body;
        try {
            const updatedOrder = await merchantOrderService.updateOrderStatus(
                Number(orderId),
                orderStatus
            );

            return res.send(
                new ApiResponse(
                    {
                        status: 'success',
                        message: 'Order status updated',
                        data: updatedOrder,
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
                        message: 'Error while updating order status',
                    },
                    500
                )
            );
        }
    }
}
