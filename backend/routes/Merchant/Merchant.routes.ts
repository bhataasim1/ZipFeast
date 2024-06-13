import express, { Router } from 'express';
import {
    MerchantAuthController,
    MerchantProfileController,
} from '../../controller';
import { authorizedUser, merchantAuth, upload } from '../../middleware';

const router: Router = express.Router();

const merchantAuthController = new MerchantAuthController();
const merchantProfileCotroller = new MerchantProfileController();

router.post('/register', merchantAuthController.registerMerchant);
router.post('/login', merchantAuthController.loginMerchant);
router.post('/token', merchantAuthController.refreshToken);
router.get(
    '/',
    merchantAuth,
    authorizedUser,
    merchantProfileCotroller.getMerchantProfile
);
router.post(
    '/profile/update',
    merchantAuth,
    authorizedUser,
    merchantProfileCotroller.updateMerchant
);
router.post(
    '/profile/upload/avatar',
    merchantAuth,
    authorizedUser,
    upload('avatar'),
    merchantProfileCotroller.uploadMerchantAvatar
);

export default router;
