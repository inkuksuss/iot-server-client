import dotenv from 'dotenv';
import socket from 'socket.io';
import mqtt from "mqtt";
import "./db";
import app from './app';
import "./models/Data";
import "./models/User";

dotenv.config();

const PORT = process.env.PORT || 3001;

const handleListing = () =>
    console.log(`😈Listening on: http://localhost:${PORT}`);

// web server
const server = app.listen(PORT, handleListing);

//mqtt server
const client = mqtt.connect("mqtt://127.0.0.1");

client.on("connect", () => {
    console.log("😇Mqtt Connect");
    client.subscribe('example'); // 읽을 토픽
});

// client.on("message", (example, message) => {
//     const obj = JSON.parse(message);
//     const date = new Date();
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const today = date.getDate();
//     const hours = date.getHours();
//     const mintues = date.getMinutes();
//     const seconds = date.getSeconds();
//     obj.createdAt = new Date(Date.UTC(year, month, today, hours, mintues, seconds));
//     const dht11 = new DHT11({
//         tmp: obj.tmp,
//         hum: obj.hum,
//         createdAt: obj.createdAt,
//         key: obj.key
//     });
//     console.log(dht11);
//     try{
//         dht11.save();
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

