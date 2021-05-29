import mongoose from 'mongoose';

const DhtSchema = new mongoose.Schema({
    hum: Number, // 온도
    tmp: Number, // 습도
    measuredAt: { // 측정시간
        type: Date,
        default: Date.now
    },
    controller: { // 사용 유저
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    product: { // 제품 번호
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    sensor: { // 센서명
        type: String,
        default: "DHT"
    },
    key: String // 제품 이름
});

const model = mongoose.model('Dht', DhtSchema);

export default model;