import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    keyName: {
        type: String,
        required: true,
    }, // 제품 시리얼 넘버
    data: [ // 데이터 Data 스키마 연동
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Data"
        }
    ],
    user: { // User 스키마와 연동
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const model = mongoose.model('Product', ProductSchema);

export default model;