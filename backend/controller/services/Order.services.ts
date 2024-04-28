import { prisma } from '../../prisma/Schema';

export class OrderServices {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async createOrderService(orderData: any) {
        this.validateOrderData(orderData);

        const {
            userId,
            productId,
            quantity,
            merchantId,
            deliveryAddress,
            paymentMethod,
        } = orderData;

        ///TODO:: Implement the Type checking of data and remove the types in the function signature
        /// remove the use of type like Number(userId) etc. in prisma queries

        await this.findUser(userId);
        const product = await this.findProduct(Number(productId), quantity);

        const totalAmount = parseFloat(product.price) * parseInt(quantity);

        const newOrder = await this.createOrder({
            userId,
            merchantId,
            quantity,
            totalAmount,
            orderStatus: 'PENDING',
            deliveryAddress,
            paymentMethod,
            productId: Number(productId),
        });

        const updatedStock = Number(product.stock!) - quantity;

        await this.updateProductStock(Number(productId), updatedStock);

        return newOrder;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async cancelOrderService(orderData: any) {
        const { orderId, userId } = orderData;

        const order = await this.findOrderByIdAndUser(
            Number(orderId),
            Number(userId)
        );

        await prisma.order.update({
            where: { id: Number(orderId) },
            data: { orderStatus: 'CANCELLED' },
        });

        await Promise.all(
            order.items.map(async (item) => {
                const updatedStock =
                    parseInt(item.product.stock!) + item.quantity;
                await this.updateProductStock(item.product.id, updatedStock);
            })
        );

        await prisma.orderItem.deleteMany({ where: { id: Number(orderId) } });

        const cancelledOrder = await prisma.order.delete({
            where: { id: Number(orderId) },
        });

        return cancelledOrder;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async updateOrderStatusService(orderData: any) {
        const { orderId, userId, deliveryAddress, paymentMethod } = orderData;

        await this.findOrderByIdAndUser(Number(orderId), Number(userId));

        const updatedOrder = await prisma.order.update({
            where: { id: Number(orderId) },
            data: { deliveryAddress, paymentMethod },
        });

        return updatedOrder;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private validateOrderData(orderData: any) {
        const {
            userId,
            productId,
            quantity,
            merchantId,
            deliveryAddress,
            paymentMethod,
        } = orderData;

        if (
            !userId ||
            !productId ||
            !quantity ||
            !merchantId ||
            !deliveryAddress ||
            !paymentMethod
        ) {
            throw new Error('Invalid order data. Missing required fields.');
        }
    }

    private async findUser(userId: number) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    private async findProduct(productId: number, quantity: number) {
        const product = await prisma.product.findUnique({
            where: { id: productId, isAvailable: true },
            // include: { items: { select: { quantity: true, product: { select: { stock: true } } } } },
        });

        if (!product || parseInt(product.stock!) < quantity) {
            throw new Error('Product is not available or out of stock');
        }
        return product;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async createOrder(orderData: any) {
        const {
            userId,
            merchantId,
            quantity,
            totalAmount,
            orderStatus,
            deliveryAddress,
            paymentMethod,
            productId,
        } = orderData;

        const newOrder = await prisma.order.create({
            data: {
                user: { connect: { id: userId } },
                merchant: { connect: { id: merchantId } },
                totalQuantity: quantity,
                totalAmount,
                orderStatus,
                deliveryAddress,
                paymentMethod,
                items: {
                    create: {
                        product: { connect: { id: productId } },
                        quantity,
                    },
                },
            },
            include: { items: true },
        });

        return newOrder;
    }

    private async updateProductStock(productId: number, updatedStock: number) {
        await prisma.product.update({
            where: { id: productId },
            data: { stock: updatedStock.toString() },
        });
    }

    private async findOrderByIdAndUser(orderId: number, userId: number) {
        const order = await prisma.order.findFirst({
            where: { id: orderId, userId },
            include: {
                items: {
                    select: {
                        quantity: true,
                        product: { select: { id: true, stock: true } },
                    },
                },
            },
        });

        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    protected async findOrderById(orderId: number) {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        return order;
    }
}
