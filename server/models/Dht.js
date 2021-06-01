import mongoose from 'mongoose';

const DhtSchema = new mongoose.Schema({
    hum: {
        type: Number,
        required: true,
        default: 0
    }, // 온도
    tmp: {
        type: Number,
        required: true,
        default: 0
    }, // 습도
    measuredAt: { // 측정시간
        type: Date,
        default: Date.now
    },
    controller: { // 사용 유저
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    product: { // 제품 번호
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    sensor: { // 센서명
        type: String,
        default: "DHT"
    },
    key: {
        required: true,
        type:String
    } // 제품 이름
});

const model = mongoose.model('Dht', DhtSchema);

export default model;