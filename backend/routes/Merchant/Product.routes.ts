import express, { Router } from 'express';
import { ProductController } from '../../controller';
import { authorizedMerchants, merchantAuth, upload } from '../../middleware';

const router: Router = express.Router();

const productController = new ProductController();

router.post(
    '/create',
    merchantAuth,
    authorizedMerchants,
    upload('productImage'),
    productController.createProduct
);

router.put(
    '/update/:productId',
    merchantAuth,
    authorizedMerchants,
    upload('productImage'),
    productController.updateProduct
);

router.delete(
    '/delete/:productId',
    merchantAuth,
    authorizedMerchants,
    productController.deleteProduct
);

router.get(
    '/all',
    merchantAuth,
    authorizedMerchants,
    productController.getAllMerchantProducts
);

export default router;
