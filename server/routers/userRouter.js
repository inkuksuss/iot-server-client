import express from 'express';
import { userDetail, getEditProfile, postEditProfile, getChangePassword, postChangePassword } from '../controllers/userController';
import { uploadAvatar } from '../middleware';
import routes from '../routes';

const userRouter = express.Router();

userRouter
    .get(routes.editProfile, getEditProfile)
    .post(routes.editProfile, uploadAvatar, postEditProfile);

userRouter
    .post(routes.changePassword, postChangePassword);

userRouter.get(routes.userDetail(), userDetail);

export default userRouter;

