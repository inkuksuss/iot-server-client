import express from "express";
import routes from "../routes";
import { onlyPrivate, onlyPublic } from '../middleware';

const apiRouter = express.Router();

// apiRouter.post(routes.weather, onlyPrivate, weather);

export default apiRouter;