import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import registerValidator from '../validators/registerValidator';
import loginValidator from '../validators/loginValidator';
import UserModel from '../../database/models/User';
import CustomErrorHandler from '../../../services/CustomErrorHnadler';
import crypto from 'crypto';
import Sequelize from 'sequelize';
import mailer from '../../../utils/mailer';
const FOURTEEN_DAYS_IN_SECONDS = 24 * 60 * 60 * 14;
const TWELVE_HOUR_IN_MILLISECONDS = 12 * 60 * 60 * 1000;
const oldDateObj = new Date();
const newDateObj = new Date();
const expiryTime = newDateObj.setTime(oldDateObj.getTime() + TWELVE_HOUR_IN_MILLISECONDS);
const Op = Sequelize.Op;
function createResetToken() {
    return crypto.randomBytes(20).toString('hex');
}
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
                    const match = await bcrypt.compare(password, encryptedPass);
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
        async forgot_password (req, res, next) {
            const { email, } = req.body;
            const token = createResetToken();
            try {
                const user = await UserModel.findOne({ where: { email: email, }, });
                if (user) {
                    try {               
                        UserModel.update({ reset_password_token: token, reset_password_expires: expiryTime, }, {
                            where: {
                                email: email,
                            },
                        }).then(async function(updated_user){
                            if(updated_user){
                                const options = {
                                    toMail: await user.get('email'),
                                    origin: req.headers.origin,
                                    token: token,
                                    username: await user.get('fullname').split(' ')[ 0 ],
                                };
                                const result = await mailer.sendPasswordResetEmail(options);
                                if(result.accepted.length){
                                    return res.status(200).json({ message: 'Kindly check your email for further instructions', });
                                } else {
                                    throw CustomErrorHandler.internalError();
                                }
                            } else {
                                throw CustomErrorHandler.internalError();
                            }
                        });
                    } catch (error) {
                        console.log(error);
                        return next(CustomErrorHandler.internalError());
                    }
                } else {
                    throw ('User not found.');
                }
            } catch (error) {
                console.log(error);
                return res.status(422).json({ Error: error, });
            }   
        },
        async reset_password (req, res, next) {
            UserModel.findOne({
                where: {
                    reset_password_token: req.body.token,
                    reset_password_expires: {
                        [ Op.gt ]: new Date(),
                    },
                },
            }).then(function(user) {
                if (user) {
                    if (req.body.newPassword === req.body.verifyPassword) {
                        let values = {
                            password: bcrypt.hashSync(req.body.newPassword, 10),
                            reset_password_token: null,
                            reset_password_expires: null,
                        };
                        try {
                            user.update(values).then(async updated_user => {
                                const options = {
                                    toMail: updated_user.get('email'),
                                    username: updated_user.get('fullname').split(' ')[ 0 ],
                                };
                                const result = await mailer.sendPasswordConfirmEmail(options);
                                if(result.accepted.length){
                                    return res.status(200).json({ message: 'Password reset successfully!', });
                                } else {
                                    throw CustomErrorHandler.internalError();
                                }
                            });
                        } catch (error) {
                            console.log(error);
                            return CustomErrorHandler.internalError();
                        } 
                    } else {
                        return res.status(422).send({
                            message: 'Passwords do not match',
                        });
                    }
                } else {
                    return res.status(400).send({
                        message: 'Password reset token is invalid or has expired.',
                    });
                }
            });
        },
    };
};
export default authController;
