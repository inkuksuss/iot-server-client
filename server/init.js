import dotenv from 'dotenv';
import socket from 'socket.io';
import mqtt from "mqtt";
import "./db";
import app from './app';
import Dht from "./models/Dht";
import Pms from "./models/Pms";
import "./models/User";

dotenv.config();

const PORT = process.env.PORT || 3001;

const handleListing = () =>
    console.log(`😈Listening on: http://localhost:${PORT}`);

// web server
const server = app.listen(PORT, handleListing);

//mqtt server
// const client = mqtt.connect("mqtt://127.0.0.1");

// client.on("connect", () => {
//     console.log("😇Mqtt Connect");
//     client.subscribe('jb/shilmu/scle/smenco/apsr/+/input/+'); // 읽을 토픽
// });

// const pmsTopic = "jb/shilmu/scle/smenco/apsr/+/input/pms"
// const dhtTopic = "jb/shilmu/scle/smenco/apsr/key/input/dht"
// const fanTopic = "jb/shilmu/scle/smenco/apsr/key/output/fan"
// const ledTopic = "jb/shilmu/scle/smenco/apsr/key/output/led"
// const speakerTopic = "jb/shilmu/scle/smenco/apsr/key/output/speaker"

// client.on("message", async(topic, message) => {
//         const productKey = String(topic.substring(27,28));
//         const productP = String(topic.substring(27,28));
//         const obj = JSON.parse(message);
//         const date = new Date();
//         const year = date.getFullYear();
//         const month = date.getMonth();
//         const today = date.getDate();
//         const hours = date.getHours();
//         const mintues = date.getMinutes();
//         const seconds = date.getSeconds();
//         obj.measuredAt = new Date(Date.UTC(year, month, today, hours, mintues, seconds));
//         const pms = await Pms.create({
//         dust: obj.dust,
//         measuredAt: obj.measuredAt,
//         key: productKey
//     });
//     console.log(pms);
//     try{
//         pms.save();
//         console.log('Success MQTT');
//     } catch (err) {
//         console.log({ message: err });
//     }
// });

// 웹소켓서버
// const io = socketIO(server);

// io.on("connection", socket => {
//     console.log("😘Socket Connect")
//     // 채팅  
//     socket.on("newMessage", ({ message }) => {  
//         socket.broadcast.emit("messageNotif", {
//             message,
//             nickname: socket.nickname || "Inguk"
//         });
//     });
//     socket.on("setNickname", ({ nickname }) => {
//         socket.nickname = nickname;
//     });
//     // Mqtt 데이터
//     socket.on("mqttSubmit", () => {
//         DHT11.find({}).sort({ _id: -1 }).limit(1).then(res => {
//             socket.emit("mqttSubmit", JSON.stringify(res[0]))
//         })
//     })
// });

