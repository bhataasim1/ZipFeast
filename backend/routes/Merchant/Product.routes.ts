import express, { Router } from 'express';
import { ProductController } from '../../controller';
import { authorizedUser, merchantAuth, upload } from '../../middleware';

const router: Router = express.Router();

const productController = new ProductController();

router.post(
    '/create',
    merchantAuth,
    authorizedUser,
    upload('productImage'),
    productController.createProduct
);

router.put(
    '/update/:productId',
    merchantAuth,
    authorizedUser,
    upload('productImage'),
    productController.updateProduct
);

router.delete(
    '/delete/:productId',
    merchantAuth,
    authorizedUser,
    productController.deleteProduct
);

export default router;
