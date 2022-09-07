import UserModel from '../../models/User'; 
import catchAsync from './../../utils/catchAsync';
import AppError from './../../utils/appError.js';
import MailerService from '../../services/mailerService.js';
import AuthService from '../../services/authService';
const forgotPassword = catchAsync(async(req, res, next)=>{
    const { email, } = req.body;
    const authServiceInstance = new AuthService(UserModel, AppError);
    const { user, token, } = await authServiceInstance.ForgotPassword(email, next);
    const options = {
        toMail: await user.get('email'),
        origin: `${req.protocol}:
        token: token,
        username: await user.get('fullname').split(' ')[ 0 ],
    };
    const MailerServiceInstance = new MailerService();
    const isSuccess = await MailerServiceInstance.sendPasswordResetEmail(options);
    if(isSuccess){
        return res.status(200).json({
            success: true,
            message: 'Kindly check your email for further instructions', 
        });
    } else {
        return next(new AppError('There was an error sending mail. Please try again later', 500));
    }
});
const resetPassword = catchAsync(async(req, res, next)=>{
    try {
        const authServiceInstance = new AuthService(UserModel, AppError);
        const updatedUser = await authServiceInstance.ResetPassword(req.body, next);
        const options = {
            toMail: updatedUser.get('email'),
            username: updatedUser.get('fullname').split(' ')[ 0 ],
        };
        const MailerServiceInstance = new MailerService();
        const isSuccess = await MailerServiceInstance.sendPasswordConfirmEmail(options);
        if(isSuccess){
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
