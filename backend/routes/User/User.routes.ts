import express from 'express';
import {
    registerUser,
    loginUser,
    logOut,
    refreshToken,
} from '../../controller/User/User.contoller';
import {
    getUserProfile,
    protectedRoutes,
} from '../../controller/User/UserDashboard.controller';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logOut);
router.post('/token', refreshToken);
// router.put('/update/:id', updateProfile);

router.use(protectedRoutes);
router.get('/profile/:id', getUserProfile);

export default router;
