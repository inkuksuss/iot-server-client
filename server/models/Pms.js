import mongoose from 'mongoose';

const PmsSchema = new mongoose.Schema({
    dust: {
        type: Number,
        default: 0,
        required: true
    }, // 미세먼지
    measuredAt: { // 측정시간
        type: Date,
        default: Date.now
    },
    controller: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    sensor: {
        type: String,
        default: "PMS"
    },
    key: {
        required: true,
        type: String
    }
});

const model = mongoose.model('Pms', PmsSchema);

export default model;