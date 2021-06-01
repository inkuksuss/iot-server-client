import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    }, // 이름
    email: {
        required: true,
        type: String
    }, // 이메일
    hashedPassword: {
        required: true,
        type: String
    }, // 암호화된 패스워드
    token: { // 유저 토큰
        type: String,
        default: ""
    }, 
    keyList: [ // 유저 제품 리스트
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    datas: [ // 유저 제품 데이터
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Data'
        }
    ]
}, { 
    versionKey: false
});

UserSchema.methods.setPassword = async function(password) {
    const hash = await bcrypt.hash(password, 10);
    this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function(password) {
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result;
};

UserSchema.methods.serialize = function() {
    const data = this.toJSON();
    delete data.hashedPassword;
    return data;
};

UserSchema.methods.generateToken = function(user) {
    const token = jwt.sign(
        { _id: this.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    user.token = token;
    return token;
}; // 유저저장

UserSchema.statics.findByToken = (token) => {
    if(token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
};

UserSchema.statics.findByEmail = function(email) {
    return this.findOne({ email })
};

const model = mongoose.model("User", UserSchema);

export default model;