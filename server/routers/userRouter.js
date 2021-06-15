import express from 'express';
import { postChangePassword, postAddKey, postDeleteKey } from '../controllers/userController';
import jwtMiddleware from '../middleware';
import routes from '../routes';

const userRouter = express.Router();

userRouter.post(routes.changePassword(), jwtMiddleware, postChangePassword);

userRouter.post(routes.addKey, jwtMiddleware, postAddKey);

userRouter.post(routes.deleteKey, jwtMiddleware, postDeleteKey);

export default userRouter;

