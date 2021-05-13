import mongoose from 'mongoose';

const DhtSchema = new mongoose.Schema({
    hum: Number,
    tmp: Number,
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
        default: "DHT"
    },
    key: String
});

const model = mongoose.model('Dht', DhtSchema);

export default model;