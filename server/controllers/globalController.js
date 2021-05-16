import User from "../models/User";
import Product from "../models/Product";
import { PythonShell } from "python-shell";


const options = {
    scriptPath: '/Users/gim-ingug/Documents/iotserver/pythonCgi',
    pythonPath: 'python3',
    pythonOptins: ['-u'],
    args: []
}

export const python = (req, res) => {
    PythonShell.run('mongo.py', options, (err, results) => {
        if(err) console.log(err);
        res.send(results);
        console.log(results)
    })
};

// Global
export const postJoin = async (req, res) => {
    const { 
        name, 
        email, 
        password, 
        confirmPassword, 
        key 
    } = req.body;
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
        const existedKey = await Product.findOne({ keyName: key });
        if(existedUser) {
            return (
                res.json({ 
                    success: false,
                    message: "이미 가입된 이메일입니다😅"
                })
            )
        }
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
        throw Error();
    };
};

export const auth = async(req, res) => {
    let keyInfos = [];
    const {
        user: {
            id,
            name,
            email,
            keyList: keyId
        }
    } = req;
    try {
        for(const key of keyId) {
            const keyInfo = await Product.findById(key);
            keyInfos.push(keyInfo);
        }
        return res.status(200)
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
