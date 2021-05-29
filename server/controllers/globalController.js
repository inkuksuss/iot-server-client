import User from "../models/User";
import Product from "../models/Product";

// Global
export const postJoin = async (req, res) => {
    const { 
        name, 
        email, 
        password, 
        confirmPassword, 
        key 
    } = req.body; // 웹 클라이언트로부터 데이터 받기
    try {
        if(!name || !email || !password || !confirmPassword || !key) {
            return (
                res.json({ 
                    success: false,
                    message: "모든 정보를 입력해주세요😅" 
                })
            )
        } // 회원가입 인증 알고리즘
        const existedUser = await User.findByEmail(email) // 이미 가입된 이메일 조회
        const existedKey = await Product.findOne({ keyName: key }); // 이미 등록된 키값 조회
        if(existedUser) {
            return (
                res.json({ 
                    success: false,
                    message: "이미 가입된 이메일입니다😅"
                })
            )
        } // 결과 
        if(existedKey) {
            return (
                res.json({
                    success: false,
                    message: "이미 등록된 키입니다😅"
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
        const user = await User.create({
            email,
            name
        });
        await user.setPassword(password);
        await user.save();
        const product = await Product.create({
            keyName: key,
            data: [],
            user: user.id
        });
        await product.save();
        user.keyList.push(product.id);
        user.save();
        res.json({ 
            success: true,
            message: "회원가입에 성공하셨습니다."
        })
    } catch(err) {
        throw Error();
    }
};

export const postLogin = async (req, res) => {
    const { email, password } = req.body; // 웹 클라이언트에게 받은 정보
    try {
        const user = await User.findByEmail(email); // 이메일 조회
        if(!email || !password) { // 로그인 알고리즘
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
        const checkPassword = await user.checkPassword(password); // 이메일이 존재한다면 비밀번호 조회
        if(!checkPassword) {
            res.json({ 
                success: false,
                message: "비밀번호를 확인해주세요😅"
            });
            return;
        }
        user.serialize();
        const token = await user.generateToken(user); // 이메일과 패스워드가 일치하다면 토큰 생성
        user.save();
        res.cookie('access_token', token, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: false
        })
            .status(200)
            .json({ 
                success: true,
                userId: user.id    
            });
    } catch(err) {
        throw Error();
    };
};

export const auth = async(req, res) => { // 사용자 인증 과정
    let keyInfos = [];
    const {
        user: {
            id,
            name,
            email,
            keyList: keyId
        }
    } = req; // 
    try {
        for(const key of keyId) { // 키 배열 원소 마다 실행
            const keyInfo = await Product.findById(key); // 제품디비에서 키 조회
            keyInfos.push(keyInfo);
        }
        return res.status(200) // 이상 없다면 유저조회 발송
            .json({ 
                id,
                name,
                email,
                keyList: keyInfos,
                isAuth: true
            });
    } catch(err) {
        return res.json({
            isAuth: false,
            error: err
        });
    }
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
            error: err
        });
    } 
};
