import express, { Router } from 'express';
import { UserOrderController } from '../../controller';
import { authorizedMerchants, userAuth } from '../../middleware';

const userOrderController = new UserOrderController();

const router: Router = express.Router();

router.get(
    '/all',
    userAuth,
    authorizedMerchants,
    userOrderController.getAllUserOrder
);

router.get(
    '/:id',
    userAuth,
    authorizedMerchants,
    userOrderController.getUserOrderById
);

router.post(
    '/create/:productId',
    userAuth,
    authorizedMerchants,
    userOrderController.createOrder
);

router.put(
    '/update/:orderId',
    userAuth,
    authorizedMerchants,
    userOrderController.updateOrder
);

router.delete(
    '/delete/:orderId',
    userAuth,
    authorizedMerchants,
    userOrderController.cancelOrder
);

export default router;
