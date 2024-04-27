import express, { Router } from 'express';
import { ProductController } from '../../controller';
import { authorizedUsers, merchantAuth, upload } from '../../middleware';

const router: Router = express.Router();

const productController = new ProductController();

router.post(
    '/create',
    merchantAuth,
    authorizedUsers,
    upload('productImage'),
    productController.createProduct
);

router.put(
    '/update/:productId',
    merchantAuth,
    authorizedUsers,
    upload('productImage'),
    productController.updateProduct
);

router.delete(
    '/delete/:productId',
    merchantAuth,
    authorizedUsers,
    productController.deleteProduct
);

export default router;
