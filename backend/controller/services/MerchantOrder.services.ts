import { OrderServices } from './Order.services';
import { prisma } from '../../prisma/Schema';

export class MerchantOrderService extends OrderServices {
    constructor() {
        super();
    }

    public async getMerchantOrders(merchantId: number) {
        const orders = await prisma.order.findMany({
            where: { merchantId },
            include: {
                user: { select: { id: true, name: true, email: true, phone: true } },
                items: {
                    select: {
                        quantity: true,
                        product: { select: { id: true, name: true, productImage: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (orders.length === 0) {
            throw new Error('No merchant order found');
        }

        return orders;
    }

    public async updateOrderStatus(orderId: number, orderStatus: string) {
        const order = await this.findOrderById(orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        if (order.orderStatus === 'DELIVERED') {
            throw new Error('Order already delivered');
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { orderStatus },
            include: {
                items: {
                    select: {
                        quantity: true,
                        product: { select: { id: true, stock: true } },
                    },
                },
            },
        });

        return updatedOrder;
    }
}
