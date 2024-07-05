import express, { Router } from 'express';
import {
    HomeServiceProfileController,
    HomeServicesAuthController,
} from '../../controller';
import { homeServiceAuth, authorizedUser, upload } from '../../middleware';

const HomeServiceRouter: Router = express.Router();
const homeServicesAuthController = new HomeServicesAuthController();
const homeServiceProfileController = new HomeServiceProfileController();

HomeServiceRouter.post(
    '/register',
    upload('avatar'),
    homeServicesAuthController.registerUser
);
HomeServiceRouter.post('/login', homeServicesAuthController.loginUser);

HomeServiceRouter.get(
    '/profile',
    homeServiceAuth,
    authorizedUser,
    homeServiceProfileController.getProfile
);
HomeServiceRouter.put(
    '/profile/update',
    authorizedUser,
    homeServiceAuth,
    upload('avatar'),
    homeServiceProfileController.updateProfile
);

export default HomeServiceRouter;
