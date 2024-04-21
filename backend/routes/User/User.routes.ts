import express from 'express';
import {
    registerUser,
    loginUser,
    logOut,
    refreshToken,
    getUserProfile,
    protectedRoutes,
    updateProfile,
} from '../../controller';
import { authorizedUser } from '../../middleware';

// const upload = UploadFilesMiddleware.getInstance()

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logOut);
router.post('/token', refreshToken);
// router.put('/update/:id', updateProfile);

router.use(protectedRoutes);
router.get('/profile/:id', authorizedUser, getUserProfile);
router.post(
    '/profile/update/:id',
    // upload.avatar,
    authorizedUser,
    updateProfile
);

export default router;
