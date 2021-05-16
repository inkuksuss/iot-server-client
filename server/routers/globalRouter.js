import express from "express";
import { postJoin, postLogin, logout, auth, python, home } from '../controllers/globalController';
import { getMe } from '../controllers/userController';
import jwtMiddleware from '../middleware';
import routes from "../routes";


const globalRouter = express.Router();


// globalRouter.get(routes.python, python);

globalRouter.post(routes.join, postJoin);

globalRouter.post(routes.login, postLogin);

globalRouter.get(routes.auth, jwtMiddleware, auth);
        
globalRouter.get(routes.logout, jwtMiddleware, logout);

globalRouter.get(routes.me, jwtMiddleware, getMe);

export default globalRouter;