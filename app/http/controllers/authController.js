import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import registerValidator from '../validators/registerValidator.js';
import loginValidator from '../validators/loginValidator.js';
import UserModel from '../../database/models/User.js';
const authController = () => {
    return {
        async register (req, res) {
            let { fullname, email, password, confirmpassword, } = req.body;
            email = email.trim();
            try {
                await registerValidator.validateAsync({ fullname, email, password, confirmpassword, });
                const user = await UserModel.findAll({ where: { email, }, });
                if (user.length > 0) {
                    return res.status(409).json({ message: 'user already exist', });
                } else {
                    const hasedPassword = await bcrypt.hash(password, 10);
                    const token = jwt.sign({ email, }, process.env.tokensecret, { expiresIn: '1H', });
                    try {
                        await UserModel.create({
                            fullname,
                            email,
                            password: hasedPassword,
                        });
                        const fourteenDaysToSeconds = 24 * 60 * 60 * 14;
                        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Max-Age=${fourteenDaysToSeconds}`);
                        res.setHeader('Access-Control-Allow-Credentials', 'true');                      
                        return res.status(200).json({ message: 'you are registred successfully..', });
                    } catch (error) {
                        return res.status(500).json({ message: `${error} - something went wrong!!!`, });
                    }
                }
            } catch (error) {
                console.log(error);
                return res.status(422).json({ error: error.message, });
            }
        },
        async login (req, res) {
            const { email, password, } = req.body;
            try {
                await loginValidator.validateAsync({ email, password, });
                try {
                    const user = await UserModel.findAll({ where: { email, }, });
                    if (user.length > 0) {
                        const encryptPass = user[ 0 ].dataValues.password;
                        const comp = bcrypt.compare(password, encryptPass);
                        if (comp) {
                            const fourteenDaysToSeconds = 24 * 60 * 60 * 14;
                            const token = jwt.sign({ email, }, process.env.tokensecret, { expiresIn: '1h', });
                            res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Max-Age=${fourteenDaysToSeconds}`);
                            res.setHeader('Access-Control-Allow-Credentials', 'true');
                            return res.status(200).json({ message: 'logged in successfully!!!', });
                        }
                        else {
                            return res.status(401).json({ err: 'wrong email or password', });
                        }
                    }
                    else {
                        return res.status(401).json({ message: 'you are not registerd..please register first', });
                    }
                } catch (error) {
                    return res.status(500).json({ message: 'iternal server err', });
                }
            } catch (error) {
                return res.status(400).json({ error: error.message, });
            }
        },
    };
};
export default authController;
