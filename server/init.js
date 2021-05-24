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

const PORT = process.env.PORT || 3001; // 포트번호 지정

const handleListing = () =>
    console.log(`😈Listening on: http://localhost:${PORT}`); // 서버 실행 콜백

// web server
const server = app.listen(PORT, handleListing); // 포트지정 및 콜백함수 실행

//mqtt server
const client = mqtt.connect("mqtt://127.0.0.1");

client.on("connect", () => { // mqtt 연결하기
    console.log("😇Mqtt Connect");
    client.subscribe('jb/shilmu/scle/smenco/apsr/+/input/+'); // 읽을 토픽
});

client.on("message", async (topic, message) => { // 구독한 토픽으로부터 데이터 받아오기
    const topicContainer = topic.split('/'); // 토픽 슬라이싱
    const obj = JSON.parse(message); // 페이로드 파싱
    if(obj.key && typeof(obj.key) === "string") { // 해당 토픽 및 페이로드 유효성 검사
        if(topicContainer[6] === 'input' && topicContainer[7] === 'pms' && obj.dust && typeof(obj.dust) === 'number') {
            const date = new Date(); // 서버에서 전송받은 시간 
            const year = date.getFullYear();
            const month = date.getMonth();
            const today = date.getDate();
            const hours = date.getHours();
            const mintues = date.getMinutes();
            const seconds = date.getSeconds();
            obj.measuredAt = new Date(Date.UTC(year, month, today, hours, mintues, seconds));
            const keyName = String(topicContainer[5])
            try{
                const product = await Product.findOne({ keyName: keyName }); // 디비에 해당 제품이 있다면
                if(product && product.keyName === obj.key){
                    if(product.user) {
                        const userId = product.user; 
                        const pms = await Pms.create({ // 데이터 디비에 새로운 객체 생성 및 저장
                            dust: obj.dust,
                            measuredAt: obj.measuredAt,
                            key: obj.key,
                            controller: userId,
                            product: product._id
                        });
                        await pms.save();
                        await Product.findOneAndUpdate({ keyName }, {$addToSet: {data: pms._id}}); // 제품 디비 업데이트
                        await User.findByIdAndUpdate({ _id: userId }, {$addToSet: { datas: pms._id}}); // 유저 디비 업데이트
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
                            controller: userId,
                            product: product._id
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
}); // 소켓 cors 설정

// Mqtt 데이터
io.on("connection", socket => { // 소켓 연결
    console.log("😘Socket Connect")

        socket.on('disconnect', () => {
            console.log("🥺Socket Disconnect")
        }); // 소켓 끊어짐 이벤트 대기

        socket.on("sendId", async(id) => { // 프론트로 부터 유저 id 받기
            const user = id.userId;
            let dataForm = [];
            if(user) {
                try{
                    const keys = await Dht.find({ controller: user }).distinct('key') // 데이터 디비에서 해당 유저의 정보 가져오기
                    for (const [index, key] of keys.entries()) {
                        const dht = await Dht.find({ key }).sort({ _id: -1 }).limit(1) // 해당 디비에서 최신 데이터 가져오기
                        const pms = await Pms.find({ key }).sort({ _id: -1 }).limit(1)
                        if(dht && pms) { // 데이터가 모두 있다면
                            const data = { // 새로운 객체 생성 
                                tmp: dht[0].tmp,
                                hum: dht[0].hum,
                                dust: pms[0].dust,
                                measuredAt: dht[0].measuredAt,
                                product: dht[0].product,
                                keyName: dht[0].key
                            }
                            dataForm[index] = data
                        }
                    }
                        socket.emit("mqttSubmit", JSON.stringify(dataForm)) // 소켓을 이용해 데이터 프론트로 전송
                } catch(err) {
                    throw Error();
                }
            }
        })

        socket.on("productId", async(id) => {
            const productId = id.id;
            console.log(id.id);
            let dataForm = [];
            if(productId) {
                try {
                    const dht = await Dht.find({ product: productId }).sort({ _id: -1 }).limit(1)
                    const pms = await Pms.find({ product: productId }).sort({ _id: -1 }).limit(1)
                    console.log(dht)
                    if(dht && pms) {
                        const data = { // 새로운 객체 생성 
                            tmp: dht[0].tmp,
                            hum: dht[0].hum,
                            dust: pms[0].dust,
                            measuredAt: dht[0].measuredAt,
                            product: dht[0].product,
                            keyName: dht[0].key
                        }
                        dataForm.push(data)
                    }
                    socket.emit("mqttData", JSON.stringify(dataForm)) // 소켓을 이용해 데이터 프론트로 전송
                } catch (err) {
                    // throw Error();
                    console.log(err);
                }
            }
        })
});

