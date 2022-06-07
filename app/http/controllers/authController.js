import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import registerValidator from '../validators/registerValidator.js';
import loginValidator from '../validators/loginValidator.js';
import UserModel from '../../database/models/User.js';
import CustomErrorHandler from '../../../services/CustomErrorHnadler.js';
const FOURTEEN_DAYS_IN_SECONDS = 24 * 60 * 60 * 14;
const authController = () => {
    return {
        async register (req, res, next) {
            let { fullname, email, password, } = req.body;
            email = email.trim();
            try {
                await registerValidator.validateAsync(req.body);
            } catch(err) {
                return next(err);
            }
            try {
                const user = await UserModel.findAll({ where: { email, }, });
                if (user.length) {
                    return next(CustomErrorHandler.alreadyExist('user already exist'));
                } else {
                    const hasedPassword = await bcrypt.hash(password, 10);
                    const token = jwt.sign({ email, }, process.env.tokensecret, { expiresIn: '1H', });
                    try {
                        await UserModel.create({
                            fullname,
                            email,
                            password: hasedPassword,
                        });
                        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Max-Age=${FOURTEEN_DAYS_IN_SECONDS}; ${process.env.NODE_ENV == 'production' ? 'Secure' : ''}`);
                        res.setHeader('Access-Control-Allow-Credentials', 'true');
                        return res.status(200).json({ message: 'you are registred successfully..', token: token, });
                    } catch (error) {
                        return next(CustomErrorHandler.internalError());
                    }
                }
            } catch (error) {
                return next(CustomErrorHandler.internalError());
            }
        },
        async login (req, res, next) {
            const { email, password, } = req.body;
            try {
                await loginValidator.validateAsync(req.body);
            } catch(err) {
                return next(err);
            }
            try {
                const user = await UserModel.findAll({ where: { email, }, });
                if (!user.length) {
                    return next(CustomErrorHandler.unAuthorized('you are not registerd..please register first'));
                } else {
                    const encryptedPass = user[ 0 ].dataValues.password;
                    const match = bcrypt.compare(password, encryptedPass);
                    if (!match) {
                        return next(CustomErrorHandler.wrongCredentials());
                    }
                    else {
                        const token = jwt.sign({ email, }, process.env.tokensecret, { expiresIn: '1h', });
                        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Max-Age=${FOURTEEN_DAYS_IN_SECONDS}; ${process.env.NODE_ENV == 'production' ? 'Secure' : ''}`);
                        res.setHeader('Access-Control-Allow-Credentials', 'true');
                        return res.status(200).json({ message: 'logged in successfully!!!', token: token, });
                    }
                }
            } catch (error) {
                return next(CustomErrorHandler.internalError());
            }
        },
    };
};
export default authController;
