import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import registerValidator from '../validators/registerValidator';
import loginValidator from '../validators/loginValidator';
import UserModel from '../../database/models/User';
import CustomErrorHandler from '../../../services/CustomErrorHandler';
const FOURTEEN_DAYS_IN_SECONDS = 24 * 60 * 60 * 14;
const authController = () => {
    return {
        async register (req, res, next) {
            let { fullname, email, password, remember, } = req.body;
            email = email.trim();
            try {
                await registerValidator.validateAsync(req.body);
            } catch (err) {
                return next(err);
            }
            try {
                const user = await UserModel.findAll({ where: { email, }, });
                if (user.length) {
                    return next(CustomErrorHandler.alreadyExist('User already exists'));
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const token = jwt.sign({ email, }, process.env.tokensecret, { expiresIn: '1H', });
                    try {
                        await UserModel.create({
                            fullname,
                            email,
                            password: hashedPassword,
                        });
                        const rememberCookie = remember ? `Max-Age=${FOURTEEN_DAYS_IN_SECONDS}` : '';
                        const secureCookie = process.env.NODE_ENV == 'production' ? 'Secure' : '';
                        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; ${rememberCookie}; ${secureCookie}`);
                        res.setHeader('Access-Control-Allow-Credentials', 'true');
                        return res.status(200).json({ message: 'You are registered successfully.', token: token, });
                    } catch (error) {
                        return next(CustomErrorHandler.internalError());
                    }
                }
            } catch (error) {
                return next(CustomErrorHandler.internalError());
            }
        },
        async login (req, res, next) {
            const { email, password, remember, } = req.body;
            try {
                await loginValidator.validateAsync(req.body);
            } catch (err) {
                return next(err);
            }
            try {
                const user = await UserModel.findAll({ where: { email, }, });
                if (!user.length) {
                    return next(CustomErrorHandler.unAuthorized('You are not registered, please register first.'));
                } else {
                    const encryptedPass = user[ 0 ].dataValues.password;
                    const match = await bcrypt.compare(password, encryptedPass);
                    if (!match) {
                        return next(CustomErrorHandler.wrongCredentials());
                    }
                    else {
                        const token = jwt.sign({ email, }, process.env.tokensecret, { expiresIn: '1h', });
                        const rememberCookie = remember ? `Max-Age=${FOURTEEN_DAYS_IN_SECONDS}` : '';
                        const secureCookie = process.env.NODE_ENV == 'production' ? 'Secure' : '';
                        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; ${rememberCookie}; ${secureCookie}`);
                        res.setHeader('Access-Control-Allow-Credentials', 'true');
                        return res.status(200).json({ message: 'Logged in successfully.', token: token, });
                    }
                }
            } catch (error) {
                return next(CustomErrorHandler.internalError());
            }
        },
    };
};
export default authController;
