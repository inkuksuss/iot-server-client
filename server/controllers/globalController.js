import User from "../models/User";

export let keyContainer = ["1","2","3","4","5"];

// Global
export const postJoin = async (req, res) => {
    const { name, email, password, confirmPassword, key } = req.body;;
    try {
        if(!name || !email || !password || !confirmPassword || !key) {
            return (
                res.json({ 
                    success: false,
                    message: "모든 정보를 입력해주세요😅" 
                })
            )
        }
        const existedUser = await User.findByEmail(email)
        if(existedUser) {
            return (
                res.json({ 
                    success: false,
                    message: "이미 가입된 이메일입니다😅"
                })
            )
        }
        if(password !== confirmPassword) {
            return (
                res.json({ 
                    success: false,
                    message: "비밀번호가 일치하지 않습니다😅"       
                })
            )
        }
        if(keyContainer.indexOf(key) < 0) {
            return (
                res.json({
                    success: false,
                    message: "등록되지 않은 제품번호입니다😅"
                })
            )
        }
        const keyfilter = keyContainer.filter(index => index !== key);
        keyContainer = keyfilter;
        const user = new User({
            email,
            name,
            key,
            avatar: "null"
        });
        await user.setPassword(password);
        await user.save();
        res.status(200)
            .json({ success: true })
    } catch(err) {
        console.log(err);
    }
};

export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if(!email || !password) {
            res.json({ 
                success: false,
                message: "이메일과 비밀번호를 입력해주세요😅"
            });
            return;
        }
        if(!user) {
            res.json({ 
                success: false,
                message: "존재하지 않는 이메일입니다😅"
            });
            return; 
        }
        const checkPassword = await user.checkPassword(password);
        if(!checkPassword) {
            res.json({ 
                success: false,
                message: "비밀번호를 확인해주세요😅"
            });
            return;
        }
        user.serialize();
        const token = await user.generateToken(user);
        user.save();
        res.cookie('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true
        })
            .status(200)
            .json({ 
                success: true,
                userId: user.id    
            });
    } catch(err) {
        console.log(err);
    };
};

export const auth = (req, res) => {
    const {
        user: {
            id,
            name,
            email,
            key
        }
    } = req;
    res.status(200)
        .json({
            id,
            name,
            email,
            key,
            isAuth: true
        });
};

export const logout = async (req, res) => {
    const {
        user: { _id: id }
    } = req;
    try {
        const user = await User.findByIdAndUpdate(id, {token: ""});
        user.save();
        res.cookie('access_token', "")
            .status(200)
            .json({ 
                success: true,
                isAuth: false
            });
    } catch(err) {
        res.json({ 
            success: false, 
            err 
        });
    } 
};
