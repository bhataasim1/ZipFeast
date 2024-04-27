import express, { Router } from 'express';
import { UserAuthController, UserProfileController } from '../../controller';
import { userAuth, authorizedUsers, upload } from '../../middleware';
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
    authorizedUsers,
    userProfileController.getUserProfile
);
router.post(
    '/profile/update/:id',
    userAuth,
    authorizedUsers,
    userProfileController.updateUser
);
router.post(
    '/profile/upload/avatar/:id',
    userAuth,
    authorizedUsers,
    upload('avatar'),
    userProfileController.uploadUserAvatar
);

export default router;
