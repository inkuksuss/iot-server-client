import multer from "multer";
import User from "./models/User";

// 사진 업로드
const multerAvatar = multer({ dest: "uploads/boards/"});

export const uploadAvatar = multerAvatar.single("avatar")

// 인증
const jwtMiddleware = async (req, res, next) => {
  const token = req.cookies['access_token'];
  if(!token) {
    return;
  }
  try{
    const userToken = await User.findByToken(token);
    const user = await User.findOne({ token });
    if(userToken && user){
      if(userToken._id === String(user._id)) {
        req.user = user;
        req.token = token;
        return next();
      }
    } 
    return;
  } catch(err) {
    console.log(err);
  }
};

export default jwtMiddleware;