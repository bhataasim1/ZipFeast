import express from 'express';
import {
    registerUser,
    loginUser,
    logOut,
    accessToken,
} from '../../controller/User/User.contoller';
import {
    getUserProfile,
    protectedRoutes,
    updateProfile,
} from '../../controller/User/UserDashboard.controller';
import { authorizedUser } from '../../middleware/ProtectedRoutes.middleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logOut);
router.post('/token', accessToken);
// router.put('/update/:id', updateProfile);

router.use(protectedRoutes);
router.get('/profile/:id', authorizedUser, getUserProfile);
router.post(
    '/profile/update/:id',
    authorizedUser,
    updateProfile
);

export default router;
