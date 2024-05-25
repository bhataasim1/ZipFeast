import express, { Router } from 'express';
import { UserAuthController, UserProfileController } from '../../controller';
import { userAuth, authorizedUser, upload } from '../../middleware';

const router: Router = express.Router();

const userAuthController = new UserAuthController();
const userProfileController = new UserProfileController();

router.post('/register', userAuthController.registerUser);
router.post('/login', userAuthController.loginUser);
router.post('/logout', userAuthController.logOutUser);
router.post('/token', userAuthController.refreshToken);

router.get(
    '/profile',
    userAuth,
    authorizedUser,
    userProfileController.getUserProfile
);
router.put(
    '/profile/update',
    userAuth,
    authorizedUser,
    userProfileController.updateUser
);
router.post(
    '/profile/upload/avatar',
    userAuth,
    authorizedUser,
    upload('avatar'),
    userProfileController.uploadUserAvatar
);

export default router;
