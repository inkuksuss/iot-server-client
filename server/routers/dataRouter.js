import express from 'express';
import { dataDetail, datas } from '../controllers/dataController';
import { onlyPrivate } from '../middleware';
import routes from '../routes';


const dataRouter = express.Router();

// dataRouter.get(routes.datas, onlyPrivate, datas);

// dataRouter.get(routes.dataDetail(), onlyPrivate, dataDetail);

export default dataRouter;