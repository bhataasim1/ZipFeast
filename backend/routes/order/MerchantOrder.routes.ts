import express, { Router } from 'express';
import { authorizedUser, userAuth } from '../../middleware';
import { MerchantOrderController } from '../../controller';

const merchantOrderController = new MerchantOrderController();

const router: Router = express.Router();

router.get(
    '/all',
    userAuth,
    authorizedUser,
    merchantOrderController.getMerchantOrders
);

router.put(
    '/update/:orderId',
    userAuth,
    authorizedUser,
    merchantOrderController.updateOrderStatus
);

export default router;
