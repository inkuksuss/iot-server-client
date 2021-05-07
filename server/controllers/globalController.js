import User from "../models/User";

// Global
export const postJoin = async (req, res) => {
    const { name, email, password, password2 } = req.body;
    try {
        if(!name || !email || !password || !password2) {
            return (
                res.json({ 
                    success: false,
                    message: "모든 정보를 입력해주세요." 
                })
            )
        }
        const existedUser = await User.findByEmail(email)
        if(existedUser) {
            return (
                res.json({ 
                    success: false,
                    message: "이미 가입된 이메일입니다."
                })
            )
        }
        if(password !== password2) {
            return (
                res.json({ 
                    success: false,
                    message: "비밀번호가 일치하지 않습니다."       
                })
            )
        }
        const user = new User({
            email,
            name,
        });
        await user.setPassword(password);
        await user.save((err, userInfo) => {
            if(err) return res.json({ success: false, err })
        });
        user.serialize();
        const token = user.generateToken();
        res.cookie('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true
        })
            .status(200)
            .json({ success: true,
                    userId: user.id
            });
    } catch(err) {
        throw Error();
    }
};

export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if(!email || !password) {
            res.json({ 
                success: false,
                message: "이메일과 비밀번호를 입력해주세요."
            });
            return;
        }
        if(!user) {
            res.json({ 
                success: false,
                message: "존재하지 않는 이메일입니다."
            });
            return; 
        }
        const checkPassword = await user.checkPassword(password);
        if(!checkPassword) {
            res.json({ 
                success: false,
                message: "비밀번호를 확인해주세요."
            });
            return;
        }
        user.serialize();
        const token = await user.generateToken(user);
        console.log(user);
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
            avatar
        }
    } = req;
    console.log(req.user);
    res.status(200)
        .json({
            id,
            name,
            email,
            avatar,
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
            .json({ success: true });
    } catch(err) {
        res.json({ 
            success: false, 
            err 
        });
    } 
};
