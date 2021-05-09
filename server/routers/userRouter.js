import express from 'express';
import { userDetail, getEditProfile, postEditProfile, postChangePassword, postAddKey } from '../controllers/userController';
import jwtMiddleware, { uploadAvatar } from '../middleware';
import routes from '../routes';

const userRouter = express.Router();

userRouter
    .get(routes.editProfile, getEditProfile)
    .post(routes.editProfile, uploadAvatar, postEditProfile);

userRouter.post(routes.changePassword, jwtMiddleware, postChangePassword);

userRouter.post(routes.addKey, jwtMiddleware, postAddKey);

userRouter.get(routes.userDetail(), userDetail);

export default userRouter;

