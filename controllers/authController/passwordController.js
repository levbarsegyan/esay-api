import AppError from './../../utils/appError.js';
import ERRORS from '../../constants/errors';
export default class PasswordController {
    constructor({ AuthService, MailerService, }){
        this.authService = AuthService;
        this.mailerService = MailerService;
        this.forgotPassword = this.forgotPassword.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }
    async forgotPassword(req, res, next) {
        const { email, } = req.body;
        try {
            const { user, token, } = await this.authService.ForgotPassword(email);
            const options = {
                toMail: await user.email,
                origin: `${req.protocol}:
                token: token,
                username: await user.fullname.split(' ')[ 0 ],
            };
            try {
                const isSuccess = await this.mailerService.sendPasswordResetEmail(options);
                if(isSuccess){
                    return res.status(200).json({
                        success: true,
                        message: 'Kindly check your email for further instructions', 
                    });
                } else {
                    return next(new AppError(ERRORS.EMAIL_ERROR, 500));
                }
            } catch (error) {
                next(error);
            }
        } catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            const updatedUser = await this.authService.ResetPassword(req.body);
            const options = {
                toMail: updatedUser.email,
                username: updatedUser.fullname.split(' ')[ 0 ],
            };
            const isSuccess = await this.mailerService.sendPasswordConfirmEmail(options);
            if(isSuccess){
                return res.status(200).json({ 
                    success: true,
                    message: 'Password Reset Successfully!',
                });
            } else {
                return next(new AppError(ERRORS.EMAIL_ERROR, 500));
            }
        } catch (error) {
            return next(error);
        }
    }
}
