import express, { Router } from 'express';
import { UserAuthController, UserProfileController } from '../../controller';
import { userAuth, authorizedUser } from '../../middleware';

const router: Router = express.Router();

const userAuthController = new UserAuthController();
const userProfileController = new UserProfileController();

router.post('/register', userAuthController.registerUser);
router.post('/login', userAuthController.loginUser);
router.post('/logout', userAuthController.logOutUser);
router.post('/token', userAuthController.refreshToken);

router.get(
    '/profile/:id',
    userAuth,
    authorizedUser,
    userProfileController.getUserProfile
);
router.post(
    '/profile/update/:id',
    userAuth,
    authorizedUser,
    userProfileController.updateUser
);
router.post(
    '/profile/upload/avatar/:id',
    userAuth,
    authorizedUser,
    userProfileController.uploadUserAvatar
);

export default router;
