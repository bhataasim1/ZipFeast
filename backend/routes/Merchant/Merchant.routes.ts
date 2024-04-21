import express, { Router } from 'express';
import { MerchantAuthController } from '../../controller';
import { merchantAuth } from '../../middleware';
import { MerchantProfileController } from '../../controller/Merchant/MerchantProfile.controller';

const router: Router = express.Router();

// const upload = UploadFilesMiddleware.getInstance()

const merchantAuthController = new MerchantAuthController();
const merchantProfileCotroller = new MerchantProfileController();

router.post('/register', merchantAuthController.registerMerchant);
router.post('/login', merchantAuthController.loginMerchant);
router.post('/token', merchantAuthController.refreshToken);
router.post(
    '/profile/update/:id',
    merchantAuth,
    merchantProfileCotroller.updateMerchant
);
router.post(
    '/profile/upload/avatar/:id',
    merchantAuth,
    merchantProfileCotroller.uploadMerchantAvatar
);

export default router;

// export const initializeRoutes = (router: Router) => {
//     router.post('/merchant/register', merchantController.register);
//     router.post('/merchant/login', merchantController.login);
//     router.get('/merchant', merchantController.getMerchant);
//     router.get('/merchant/:id', merchantController.getMerchantById);
//     router.put('/merchant/:id', merchantController.updateMerchant);
//     router.delete('/merchant/:id', merchantController.deleteMerchant);
//     router.get('/merchant/:id/products', merchantController.getMerchantProducts);
//     router.post('/merchant/:id/products', merchantController.addMerchantProduct);
//     router.get('/merchant/:id/orders', merchantController.getMerchantOrders);
//     router.get('/merchant/:id/orders/:orderId', merchantController.getMerchantOrderById);
//     router.put('/merchant/:id/orders/:orderId', merchantController.updateMerchantOrder);
//     router.delete('/merchant/:id/orders/:orderId', merchantController.deleteMerchantOrder);
//     router.get('/merchant/:id/orders/:orderId/items', merchantController.getMerchantOrderItems);
//     router.post('/merchant/:id/orders/:orderId/items', merchantController.addMerchantOrderItem);
//     router.get('/merchant/:id/orders/:orderId/items/:itemId', merchantController.getMerchantOrderItemById);
//     router.put('/merchant/:id/orders/:orderId/items/:itemId', merchantController.updateMerchantOrderItem);
//     router.delete('/merchant/:id/orders/:orderId/items/:itemId', merchantController.deleteMerchantOrderItem);
//     router.get('/merchant/:id/orders/:orderId/items/:itemId/fulfillment', merchantController.getMerchantOrderItemFulfillment);
//     router.post('/merchant/:id/orders/:orderId/items/:itemId/fulfillment', merchantController.addMerchantOrderItemFulfillment);
//     router.get('/merchant/:id/orders/:orderId/items/:itemId/fulfillment/:fulfillmentId', merchantController.getMerchantOrderItemFulfillmentById);
//     router.put('/merchant/:id/orders/:orderId/items/:itemId/fulfillment/:fulfillmentId', merchantController.updateMerchantOrderItemFulfillment);
//     router.delete('/merchant/:id/orders/:orderId/items/:itemId/fulfillment/:fulfillmentId', merchantController.deleteMerchantOrderItemFulfillment);
// };
