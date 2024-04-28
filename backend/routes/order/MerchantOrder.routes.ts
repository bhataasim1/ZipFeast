import express, { Router } from 'express';
import { authorizedMerchants, userAuth } from '../../middleware';
import { MerchantOrderController } from '../../controller';

const merchantOrderController = new MerchantOrderController();

const router: Router = express.Router();

router.get(
    '/all',
    userAuth,
    authorizedMerchants,
    merchantOrderController.getMerchantOrders
);

router.put(
    '/update/:orderId',
    userAuth,
    authorizedMerchants,
    merchantOrderController.updateOrderStatus
);

export default router;
