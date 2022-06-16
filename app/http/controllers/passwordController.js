import bcrypt from 'bcrypt';
import UserModel from '../../database/models/User.js';
import CustomErrorHandler from '../../../services/CustomErrorHnadler.js';
import crypto from 'crypto';
import Sequelize from 'sequelize';
import mailer from '../../../utils/mailer.js';
const TWELVE_HOUR_IN_MILLISECONDS = 12 * 60 * 60 * 1000;
const oldDateObj = new Date();
const newDateObj = new Date();
const expiryTime = newDateObj.setTime(oldDateObj.getTime() + TWELVE_HOUR_IN_MILLISECONDS);
const Op = Sequelize.Op;
const createResetToken = () => {
    return crypto.randomBytes(20).toString('hex');
};
const passwordController = () => {
    return {
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
                            user.update(values).then(async (updated_user) => {
                                const options = {
                                    toMail: updated_user.get('email'),
                                    username: updated_user.get('fullname').split(' ')[ 0 ],
                                };
                                const result = await mailer.sendPasswordConfirmEmail(options);
                                if(result.accepted.length){
                                    return res.status(200).json({ message: 'Password Reset Successfully!', });
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
export default passwordController;
