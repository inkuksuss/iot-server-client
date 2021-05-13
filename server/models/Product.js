import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    keyName: String,
    data: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Data"
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const model = mongoose.model('Product', ProductSchema);

export default model;