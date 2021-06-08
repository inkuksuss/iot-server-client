import dotenv from 'dotenv';
import socketIO from 'socket.io';
import mqtt from "mqtt";
import "./db";
import app from './app';
import Dht from "./models/Dht";
import Pms from "./models/Pms";
import Product from './models/Product';
import User from "./models/User";
import Led from "./models/Led";

const options = {
    port: 1883,
    username: 'inguk',
    password: 'ccit2',
    clientId:
}

dotenv.config();

const PORT = process.env.PORT || 3001; // 포트번호 지정

const handleListing = () =>
    console.log(`😈Listening on: http://localhost:${PORT}`); // 서버 실행 콜백

// web server
const server = app.listen(PORT, handleListing); // 포트지정 및 콜백함수 실행


//mqtt server
const client = mqtt.connect("mqtt://127.0.0.1", options);
// const client = mqtt.connect("mqtt://127.0.0.1", options);

client.on("connect", () => { // mqtt 연결하기
    console.log("😇Mqtt Connect");
    client.subscribe('jb/shilmu/scle/smenco/apsr/+/input/+'); // 읽을 토픽
    client.subscribe('jb/shilmu/scle/smenco/apsr/+/output/led/res');
});

client.on("message", async (topic, message) => { // 구독한 토픽으로부터 데이터 받아오기
    const topicContainer = topic.split('/'); // 토픽 슬라이
    const obj = JSON.parse(message); // 페이로드 파싱
    const date = new Date(); // 서버에서 전송받은 시간 
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = date.getDate();
    const hours = date.getHours();
    const mintues = date.getMinutes();
    const seconds = date.getSeconds();
    const keyName = String(topicContainer[5])
    obj.measuredAt = new Date(Date.UTC(year, month, today, hours, mintues, seconds));
    if(obj.key && typeof(obj.key) === "string" && topicContainer[7] === "pms" && obj.dust) { // 해당 토픽 및 페이로드 유효성 검사
        try{
            const product = await Product.findOne({ keyName: keyName }); // 디비에 해당 제품이 있다면
            if(product && product.keyName === obj.key){
                if(product.user) {
                    const userId = product.user; 
                    const pms = await Pms.create({ // 데이터 디비에 새로운 객체 생성 및 저장
                        dust: obj.dust / 100,
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
    } else if(obj.key && typeof(obj.key) === "string" && topicContainer[7] === "dht" && obj.tmp && obj.hum) {
            try{
                const product = await Product.findOne({ keyName: keyName });
                if(product && product.keyName === obj.key){
                    if(product.user) {
                        const userId = product.user;
                        const dht = await Dht.create({
                            tmp: obj.tmp / 100,
                            hum: obj.hum / 100,
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
        }
});


//웹소켓서버
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
}); // 소켓 cors 설정

// const io = socketIO(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// }); // 소켓 cors 설정

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
                    console.log(err);
                }
            }
        })

        socket.on("productId", async(id) => {
            const productId = id.id;
            let data = {};
            if(productId) {
                try {
                    const dht = await Dht.find({ product: productId }).sort({ _id: -1 }).limit(1)
                    const pms = await Pms.find({ product: productId }).sort({ _id: -1 }).limit(1)
                    if(dht && pms) {
                        data = { // 새로운 객체 생성 
                            tmp: dht[0].tmp,
                            hum: dht[0].hum,
                            dust: pms[0].dust,
                            measuredAt: dht[0].measuredAt,
                            product: dht[0].product,
                            keyName: dht[0].key
                        }
                    }
                    socket.emit("mqttData", JSON.stringify(data)) // 소켓을 이용해 데이터 프론트로 전송
                } catch (err) {
                    // throw Error();
                    console.log(err);
                }
            }
        })

        socket.on("publishLED", async(data) => {
            const { Red, Yellow, Green, auto, key, product, controller } = data
            const LedTopic = `jb/shilmu/scle/smenco/apsr/${key}/output/led`; // 퍼블리쉬 토픽
            const date = new Date(); // 서버에서 전송받은 시간 
            const year = date.getFullYear();
            const month = date.getMonth();
            const today = date.getDate();
            const hours = date.getHours();
            const mintues = date.getMinutes();
            const seconds = date.getSeconds();
            const measuredAt = new Date(Date.UTC(year, month, today, hours, mintues, seconds));
            try {
                const user = await User.findById(controller)
                const products = await User.findOne({ keyList: {$in : [ product ]} });
                const keyCheck = await Product.findById(product)
                if(user.id === products.id && keyCheck.keyName === String(key)) {
                    const verifyData = {
                        Red,
                        Yellow,
                        Green,
                        auto,
                        key
                    }
                    const LedJson = JSON.stringify(verifyData); // 웹에서 받은 데이터 제이슨화
                    client.publish(LedTopic, LedJson, (err) => { // 퍼블리쉬
                        if(err) {
                            return console.log(err) // 에러발생시
                        }
                        client.on('message', async(LedTopicRes, response) => { // 에러없다면 콜백토픽 서브
                            const ledTopic = LedTopicRes.split('/');
                            if(String(ledTopic[5]) === key && ledTopic[6] === 'output' && ledTopic[7] === 'led' && ledTopic[8] === 'res') {
                                if(response) { // 데이터가 있다면
                                    const result = JSON.parse(response.toString()); // 데이터 파싱
                                    if(result.success && result.key === key) { // 데이터 속 결과가 성공이라면
                                        const led = await Led.create({
                                            auto: result.auto,
                                            Red: result.Red,
                                            Green: result.Green,
                                            Yellow: result.Yellow,
                                            measuredAt,
                                            controller,
                                            product,
                                            key
                                        })                    
                                        led.save();
                                        socket.emit('LEDResult', result); // 웹으로 실시간 결과 전달
                                    }
                                }
                            }
                        });
                    });
                }
            } catch(err) {
                console.log(err);
            }
        })
        socket.on("publishFan", async(data) => {
            const { on, auto, key, product, controller } = data
            const fanTopic = `jb/shilmu/scle/smenco/apsr/${key}/output/fan`; // 퍼블리쉬 토픽
            const date = new Date(); // 서버에서 전송받은 시간 
            const year = date.getFullYear();
            const month = date.getMonth();
            const today = date.getDate();
            const hours = date.getHours();
            const mintues = date.getMinutes();
            const seconds = date.getSeconds();
            const measuredAt = new Date(Date.UTC(year, month, today, hours, mintues, seconds));
            try {
                const user = await User.findById(controller)
                const products = await User.findOne({ keyList: {$in : [ product ]} });
                const keyCheck = await Product.findById(product)
                if(user.id === products.id && keyCheck.keyName === String(key)) {
                    const verifyData = {
                        on,
                        auto,
                        key
                    }
                    const fanJson = JSON.stringify(verifyData); // 웹에서 받은 데이터 제이슨화
                    client.publish(fanTopic, fanJson, (err) => { // 퍼블리쉬
                        if(err) {
                            return console.log(err) // 에러발생시
                        }
                        client.on('message', async(fanTopicRes, response) => { // 에러없다면 콜백토픽 서브
                            const fanTopic = fanTopicRes.split('/');
                            if(String(fanTopic[5]) === key && fanTopic[6] === 'output' && fanTopic[7] === 'fan' && fanTopic[8] === 'res') {
                                if(response) { // 데이터가 있다면
                                    const result = JSON.parse(response.toString()); // 데이터 파싱
                                    if(result.success && result.key === key) { // 데이터 속 결과가 성공이라면
                                        const fan = await Fan.create({
                                            auto: result.auto,
                                            on: result.on,
                                            measuredAt,
                                            controller,
                                            product,
                                            key
                                        })                    
                                        fan.save();
                                        socket.emit('fanResult', result); // 웹으로 실시간 결과 전달
                                    }
                                }
                            }
                        });
                    });
                }
            } catch(err) {
                console.log(err);
            }
        })
        socket.on("publishBuz", async(data) => {
            const { on, auto, key, product, controller } = data
            const buzTopic = `jb/shilmu/scle/smenco/apsr/${key}/output/buz`; // 퍼블리쉬 토픽
            const date = new Date(); // 서버에서 전송받은 시간 
            const year = date.getFullYear();
            const month = date.getMonth();
            const today = date.getDate();
            const hours = date.getHours();
            const mintues = date.getMinutes();
            const seconds = date.getSeconds();
            const measuredAt = new Date(Date.UTC(year, month, today, hours, mintues, seconds));
            try {
                const user = await User.findById(controller)
                const products = await User.findOne({ keyList: {$in : [ product ]} });
                const keyCheck = await Product.findById(product)
                if(user.id === products.id && keyCheck.keyName === String(key)) {
                    const verifyData = {
                        on,
                        auto,
                        key
                    }
                    const buzJson = JSON.stringify(verifyData); // 웹에서 받은 데이터 제이슨화
                    client.publish(buzTopic, buzJson, (err) => { // 퍼블리쉬
                        if(err) {
                            return console.log(err) // 에러발생시
                        }
                        client.on('message', async(buzTopicRes, response) => { // 에러없다면 콜백토픽 서브
                            const buzTopic = buzTopicRes.split('/');
                            if(String(buzTopic[5]) === key && buzTopic[6] === 'output' && buzTopic[7] === 'buz' && buzTopic[8] === 'res') {
                                if(response) { // 데이터가 있다면
                                    const result = JSON.parse(response.toString()); // 데이터 파싱
                                    if(result.success && result.key === key) { // 데이터 속 결과가 성공이라면
                                        const buz = await Buz.create({
                                            auto: result.auto,
                                            on: result.on,
                                            measuredAt,
                                            controller,
                                            product,
                                            key
                                        })                    
                                        buz.save();
                                        socket.emit('buzResult', result); // 웹으로 실시간 결과 전달
                                    }
                                }
                            }
                        });
                    });
                }
            } catch(err) {
                console.log(err);
            }
        })
});

// // 클라이언트
// const topics  =`jb/shilmu/scle/smenco/apsr/3/output/led`;
// client.on('message', (topics, data) => { // 제어 결과 서브
//     const parsedData = JSON.parse(data.toString()); // 데이터 파싱
//     if(parsedData) { // 데이터가 있다면
//         const result = { // 데이터 객체속 성공여부 포함하여 객체 재생   success: true,
//             ...parsedData
//         }
//         const resultJson = JSON.stringify(result) // 객체 제이슨화
//         client.publish('jb/shilmu/scle/smenco/apsr/3/output/led/res', resultJson) // 서버로 퍼블리쉬
//     }
// })


// else if(topicContainer[7] === 'led' && topicContainer[8] === 'res') {
//     if(obj) { // 데이터가 있다면
//         if(obj.success) { // 데이터 속 결과가 성공이라면
//             const led = await Led.create({
//                 auto: obj.auto,
//                 Red: obj.Red,
//                 Yellow: obj.Yellow,
//                 Green: obj.Green,
//                 measuredAt: obj.measuredAt,
//                 controller: obj.controller,
//                 product: obj.product,
//                 key: obj.key
//             });
//             led.save()
//             socket.emit('LEDResult', obj); // 웹으로 실시간 결과 전달
//         }
//     }
// }
