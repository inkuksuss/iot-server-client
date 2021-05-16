import dotenv from 'dotenv';
import socketIO from 'socket.io';
import mqtt from "mqtt";
import "./db";
import app from './app';
import Dht from "./models/Dht";
import Pms from "./models/Pms";
import Product from './models/Product';
import User from "./models/User";

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
    client.subscribe('jb/shilmu/scle/smenco/apsr/+/input/+'); // 읽을 토픽
});

client.on("message", async (topic, message) => {
    const topicContainer = topic.split('/');
    const obj = JSON.parse(message);
    if(obj.key && typeof(obj.key) === "string") {
        if(topicContainer[6] === 'input' && topicContainer[7] === 'pms' && obj.dust && typeof(obj.dust) === 'number') {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth();
            const today = date.getDate();
            const hours = date.getHours();
            const mintues = date.getMinutes();
            const seconds = date.getSeconds();
            obj.measuredAt = new Date(Date.UTC(year, month, today, hours, mintues, seconds));
            const keyName = String(topicContainer[5])
            try{
                const product = await Product.findOne({ keyName: keyName });
                console.log(product.user)
                if(product && product.keyName === obj.key){
                    if(product.user) {
                        const userId = product.user;
                        const pms = await Pms.create({
                            dust: obj.dust,
                            measuredAt: obj.measuredAt,
                            key: obj.key,
                            controller: userId
                        });
                        await pms.save();
                        await Product.findOneAndUpdate({ keyName }, {$addToSet: {data: pms._id}});
                        await User.findByIdAndUpdate({ _id: userId }, {$addToSet: { datas: dht._id}});
                        console.log(pms);
                        console.log('Success MQTT');
                    }
                }
            } catch (err) {
                console.log(err);
            }
        } 

        else if(topicContainer[6] === 'input' && topicContainer[7] === 'dht' && obj.tmp && obj.hum && typeof(obj.tmp) === "number" && typeof(obj.hum) === "number") {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth();
            const today = date.getDate();
            const hours = date.getHours();
            const mintues = date.getMinutes();
            const seconds = date.getSeconds();
            obj.measuredAt = new Date(Date.UTC(year, month, today, hours, mintues, seconds));
            const keyName = String(topicContainer[5])
            try{
                const product = await Product.findOne({ keyName: keyName });
                if(product && product.keyName === obj.key){
                    if(product.user) {
                        const userId = product.user;
                        const dht = await Dht.create({
                            tmp: obj.tmp,
                            hum: obj.hum,
                            measuredAt: obj.measuredAt,
                            key: obj.key,
                            controller: userId
                        });
                        await dht.save();
                        await Product.findOneAndUpdate({ keyName }, {$addToSet: { data: dht._id }});
                        await User.findByIdAndUpdate({ _id: userId }, {$addToSet: { datas: dht._id }});
                        console.log(dht);
                        console.log('Success MQTT');
                    }
                }
            } catch (err) {
                console.log(err);
            }
        } else{
            console.log('fail');   
        }
    } else {
        console.log('no key');   
    }
});

//웹소켓서버
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", socket => {
    console.log("😘Socket Connect")
    
    // Mqtt 데이터
    socket.on("mqttSubmit", () => {
        Dht.find({}).sort({ _id: -1 }).limit(1).then(res => {
            socket.emit("mqttSubmit", JSON.stringify(res[0]))
        })
    })
});

