import express, { Router } from 'express';
import { UserOrderController } from '../../controller';
import { authorizedUser, userAuth } from '../../middleware';

const userOrderController = new UserOrderController();

const router: Router = express.Router();

router.get(
    '/all',
    userAuth,
    authorizedUser,
    userOrderController.getAllUserOrder
);

router.get(
    '/:orderId',
    userAuth,
    authorizedUser,
    userOrderController.getUserOrderById
);

router.post(
    '/create',
    userAuth,
    authorizedUser,
    userOrderController.createOrder
);

router.put(
    '/update/:orderId',
    userAuth,
    authorizedUser,
    userOrderController.updateOrder
);

router.delete(
    '/delete/:orderId',
    userAuth,
    authorizedUser,
    userOrderController.cancelOrder
);

export default router;
