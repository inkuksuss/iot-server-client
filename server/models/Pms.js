import mongoose from 'mongoose';

const PmsSchema = new mongoose.Schema({
    dust: Number,
    measuredAt: {
        type: Date,
        default: Date.now
    },
    controller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rater: {
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