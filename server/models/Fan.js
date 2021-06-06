import mongoose from 'mongoose';

const FanSchema = new mongoose.Schema({
    auto: {
        type: Boolean,
        required: true,
        default: false
    },
    on: {
        default: false,
        type: Boolean,
        required: true
    },
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
    key: {
        required: true,
        type: String
    } // 제품 이름
});

const model = mongoose.model('Fan', BuzSchema);

export default model;