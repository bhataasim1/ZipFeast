import express, { Router } from 'express';
import { IndexController } from '../controller/index.controller';

const router: Router = express.Router();
const indexController = new IndexController();

router.get('/merchants', indexController.getMerchants);
router.get('/merchant/:storeName', indexController.getMerchantByName);
router.get('/products', indexController.getProducts);
router.get('/products/:productId', indexController.getProductById);
router.get('/search', indexController.searchProducts);
router.get('/get-categories', indexController.getCategories);

export default router;
