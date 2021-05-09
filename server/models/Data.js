import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema({
    humidity: Number,
    degree: Number,
    dust: Number,
    measuredAt: {
        type: Date,
        default: Date.now
    },
    provided: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const model = mongoose.model('Data', DataSchema);

export default model;