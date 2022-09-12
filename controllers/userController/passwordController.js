import bcrypt from 'bcrypt';
import UserModel from './../../database/models/User.js'; 
import catchAsync from './../../utils/catchAsync';
import AppError from './../../utils/appError.js';
import crypto from 'crypto';
import Sequelize from 'sequelize';
import mailer from './../../services/mailer.js';
const TWELVE_HOUR_IN_MILLISECONDS = 12 * 60 * 60 * 1000;
const oldDateObj = new Date();
const newDateObj = new Date();
const expiryTime = newDateObj.setTime(oldDateObj.getTime() + TWELVE_HOUR_IN_MILLISECONDS);
const Op = Sequelize.Op;
const createResetToken = () => {
    return crypto.randomBytes(20).toString('hex');
};
const forgotPassword = catchAsync(async(req, res, next)=>{
    const { email, } = req.body;
    const user = await UserModel.findOne({ where: { email: email, }, });
    if(!user){
        return next(new AppError('No user exists with this email-address', 404));
    }
    const token = createResetToken();
    try {               
        await UserModel.update({ reset_password_token: token, reset_password_expires: expiryTime, }, {
            where: {
                email: email,
            },
        });
        const options = {
            toMail: await user.get('email'),
            origin: `${req.protocol}:
            token: token,
            username: await user.get('fullname').split(' ')[ 0 ],
        };
        const result = await mailer.sendPasswordResetEmail(options);
        if(result.accepted.length){
            return res.status(200).json({
                success: true,
                message: 'Kindly check your email for further instructions', 
            });
        } else {
            return next(new AppError('There was an error sending mail. Please try again later', 500));
        }
    } catch (error) {
        return res.status(422).json({
            success: false,
            Error: error, 
        });
    }
});
const resetPassword = catchAsync(async(req, res, next)=>{
    const user = await UserModel.findOne({
        where: {
            reset_password_token: req.body.token,
            reset_password_expires: {
                [ Op.gt ]: new Date(),
            },
        },
    });
    if(!user){
        return next(new AppError('Password reset token is invalid or has expired.', 401));
    }
    if (req.body.newPassword !== req.body.verifyPassword){
        return next(new AppError('Passwords does not match', 400));
    }
    let values = {
        password: bcrypt.hashSync(req.body.newPassword, 10),
        reset_password_token: null,
        reset_password_expires: null,
    };
    try {
        const updatedUser = await user.update(values);
        const options = {
            toMail: updatedUser.get('email'),
            username: updatedUser.get('fullname').split(' ')[ 0 ],
        };
        const result = await mailer.sendPasswordConfirmEmail(options);
        if(result.accepted.length){
            return res.status(200).json({ 
                success: true,
                message: 'Password Reset Successfully!',
            });
        }
    } catch (error) {
        return res.json({
            error,
        });
    }
});
export { forgotPassword, resetPassword };
