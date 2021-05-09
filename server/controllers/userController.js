import routes from "../routes";
import User from "../models/User";
import { keyContainer } from './globalController';

// Users
export const getMe =  async (req, res) => {
    const { 
        user: { id }
    } = req;
    console.log(req.user);
    try {
        const user = await User.findById(id)
        console.log(user);
        res.json({ user })
    } catch(err) {
        res.json({ error: "해당 페이지를 찾을 수 없습니다."});
    }
};

// Users
export const userDetail = async (req, res) => {
    const {
      params: { id }
    } = req;
    try {
      const user = await User.findById(id);
      res.render("userDetail", { pageTitle: "User Detail", user });
    } catch (error) {
      res.redirect(routes.home);
    }
};

export const getEditProfile = (req, res) => {
     res.render("editProfile", { pageTitle: "Edit Profile" })};

export const postEditProfile = async (req, res) => {
    const {
         body: {    
            name,
            email
         },
         file
    } = req;    /////////////////////////////// req.user로 하면 에러뜸 why?
    try {
        await User.findByIdAndUpdate({_id: req.user._id}, {$set: {  
            name,
            email,
            avatar: (file ? file.path : req.user.avatar)
        }}, {new: true});
        res.redirect(routes.me);
    } catch (err) {
        res.redirect(routes.editProfile);
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
        await User.findByIdAndUpdate(userId, {hashedPassword: newPassword});
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
    console.log(userId, newKey);
    try{
        if(!userId || !newKey) {
            return res.json({
                success: false,
                message: "모든 정보를 입력해주세요😅"
            })
        }
        const user = await User.findById(userId)
        // console.log(keyContainer);
        // console.log(user.key);
        if(user.key.indexOf(newKey) >= 0) {
            return res.json({
                success: false,
                message: "이미 등록하신 제품번호입니다😅"
            })
        }
        if(keyContainer.indexOf(newKey) < 0) {
            return res.json({
                success: false,
                message: "등록되지 않은 제품번호입니다😅"
            });
        }
        console.log(user.key.length);
        await User.findByIdAndUpdate(userId, {$addToSet: {key: newKey }});
        user.save();
        res.json({
            success: true,
            message: "제품 등록 완료!"
        });
    } catch(err) {
        res.json({
            success: false,
            error: "알수없는 오류가 발생했습니다😅"
        });
    }
}