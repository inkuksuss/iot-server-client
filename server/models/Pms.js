import mongoose from 'mongoose';

const PmsSchema = new mongoose.Schema({
    dust: Number, // 미세먼지
    measuredAt: { // 측정시간
        type: Date,
        default: Date.now
    },
    controller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    sensor: {
        type: String,
        default: "PMS"
    },
    key: String
});

const model = mongoose.model('Pms', PmsSchema);

export default model;