import User from "../models/User";
import Product from "../models/Product"
import Dht from '../models/Dht';
import Pms from "../models/Pms";

// Users
export const getMe =  async (req, res) => {
    const { 
        user: { id }
    } = req;
    try {
        const user = await User.findById(id)
        res.json({ user })
    } catch(err) {
        res.json({ error: "해당 페이지를 찾을 수 없습니다."});
    }
};

export const postChangePassword =  async (req,res) => {
    const { body:
            {
                oldPassword,
                Password,
                Password2,
                userId
            }
    } = req;
    try {
        if(!userId || !Password || !Password2 || !oldPassword) {
            return res.json({
                success: false, 
                message: "모든 정보를 입력해주세요😅"
            })
        }
        if(Password !== Password2) {
            return res.json({
                success: false, 
                message: "비밀번호 확인이 일치하지 않습니다😅"
            })
        }
        const user = await User.findById(userId);
        const checkPassword = await user.checkPassword(oldPassword);
        if(!checkPassword) {
            return res.json({ 
                success: false,
                message: "기존 비밀번호를 확인해주세요😅"
            });
        }
        const newPassword = await user.setPassword(Password);
        await User.findByIdAndUpdate(userId, { hashedPassword: newPassword });
        user.save();
        res.json({
            success: true,
            message: "비밀번호 변경 성공"
        })
    } catch(err) {
        res.json({ 
            success: false,
            error: '에러 발생😅'
        })
    }
};
   
export const postAddKey = async (req, res) => {
    const {
        body: { 
            userId, 
            newKey 
        }
    } = req;
    try{
        if(!userId || !newKey) {
            return res.json({
                success: false,
                message: "모든 정보를 입력해주세요😅"
            })
        }
        const user = await User.findById(userId)
        const existedKey = await Product.findOne({ keyName: newKey });
        if(existedKey) {
            return res.json({
                success: false,
                message: "이미 등록된 제품번호입니다😅"
            });
        }
        const key = await Product.create({
            keyName: newKey,
            user: userId
        })
        await user.keyList.push(key.id);
        await user.save();
        // await User.findByIdAndUpdate(userId, {$addToSet: { keyList: key.id }});
        res.json({
            data: key,
            success: true,
            message: "제품 등록 완료!"
        });
    } catch(err) {
        res.json({
            success: false,
            error: "알수없는 오류가 발생했습니다😅"
        });
    }
};

export const postDeleteKey = async(req, res) => {
    const {
        body,
        user: { _id: userId }
    } = req;
    const id = Object.keys(body)[0]
    try {
        const product = await Product.findById(id);
        if(String(product.user) === String(userId)) {
            await Product.findByIdAndDelete(id);
            await User.findByIdAndUpdate(userId, {$pull: { keyList: id }});
            const dhts = await Dht.find({product: id});
            const pmss = await Pms.find({product: id});
            for(const dht of dhts) {
                await Dht.findByIdAndDelete(dht._id)
            };
            for(const pms of pmss) {
                await Pms.findByIdAndDelete(pms._id);
            };
            res.json({
                success: true,
                message: "삭제 성공"
            });
        }
    } catch (err) {
        res.json({
            success: false,
            message: "삭제 실패"
        });
    }
}