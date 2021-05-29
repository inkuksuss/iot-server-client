import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { // 몽고DB 연결 설정
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
    }
);

const db = mongoose.connection;
const handleOpen = () => console.log("😎Connected to DB") // 몽고디비 연결시 콜백
const handleError = (error) => console.log(`🥵Error on DB Connection: ${error}`) // 몽고디비 연결 실패시 에러 콜백

db.once("open", handleOpen);
db.on('error', handleError);