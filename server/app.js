import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyPareser from "body-parser";
import cors from "cors";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import dataRouter from "./routers/dataRouter";
import apiRouter from "./routers/apiRouter";
import routes from "./routes";

const app = express();
const cors_origin = [`http://localhost:3000`];
// const cors_origin = [`http://114.71.241.151:3000`];

//middlewares
app.use(helmet({ 
    contentSecurityPolicy: false 
})); // 보안
app.use(cookieParser()); // 쿠키 저장
app.use(cors({
    origin: cors_origin,
    credentials: true
})) // cors설정
app.use(bodyPareser.json()); //JSON 가져옴
app.use(bodyPareser.urlencoded({ extended: true })); // FORM형식 가져옴
app.use(morgan("dev")); // 접속 추적

//Router
app.use(routes.api, apiRouter); 
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.data, dataRouter);

export default app;