import express from 'express';
import {
    registerUser,
    loginUser,
    logOut,
    accessToken,
    getUserProfile,
    protectedRoutes,
    updateProfile,
} from '../../controller';
import { authorizedUser, upload } from '../../middleware';



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
    upload.single('avatar'),
    authorizedUser,
    updateProfile
);

export default router;
