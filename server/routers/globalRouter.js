import express from "express";
import { home, postHome, search } from '../controllers/dataController';
import { postJoin, postLogin, logout, auth } from '../controllers/globalController';
import { getMe } from '../controllers/userController';
import jwtMiddleware from '../middleware';
import routes from "../routes";


const globalRouter = express.Router();

globalRouter
    .get(routes.home, home)
    .post(routes.home, postHome);

globalRouter.post(routes.join, postJoin);

globalRouter.post(routes.login, postLogin);

globalRouter.get(routes.auth, jwtMiddleware, auth);
        
globalRouter.get(routes.logout, jwtMiddleware, logout);

globalRouter.get(routes.me, jwtMiddleware, getMe);

export default globalRouter;