import express from 'express';
import { dataUser } from '../controllers/dataController';
import jwtMiddleware from '../middleware';
import routes from '../routes';


const dataRouter = express.Router();

dataRouter.get(routes.dataUser(), dataUser);

export default dataRouter;