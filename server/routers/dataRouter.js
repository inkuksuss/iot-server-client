import express from 'express';
import { dataUser, deviceDetail, postDateData } from '../controllers/dataController';
import jwtMiddleware from '../middleware';
import routes from '../routes';


const dataRouter = express.Router();

dataRouter.get(routes.dataUser(), jwtMiddleware, dataUser);

dataRouter.get(routes.detailData(),jwtMiddleware, deviceDetail);
dataRouter.post(routes.detailData(),jwtMiddleware, postDateData);

export default dataRouter;