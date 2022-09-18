import AppError from './../../utils/appError.js';
export default class PasswordController {
    constructor({ AuthService, MailerService, UserModel, }){
        this.authService = AuthService;
        this.mailerService = MailerService;
        this.UserModel = UserModel;
        this.forgotPassword = this.forgotPassword.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }
    async forgotPassword(req, res, next) {
        const { email, } = req.body;
        const { user, token, } = await this.authService.ForgotPassword(email);
        const options = {
            toMail: await user.get('email'),
            origin: `${req.protocol}:
            token: token,
            username: await user.get('fullname').split(' ')[ 0 ],
        };
        console.log(options);
        try {
            const isSuccess = await this.mailerService.sendPasswordResetEmail(options);
            if(isSuccess){
                return res.status(200).json({
                    success: true,
                    message: 'Kindly check your email for further instructions', 
                });
            } else {
                return next(new AppError('There was an error sending mail. Please try again later', 500));
            }
        } catch (error) {
            console.log(error);
            return next(new AppError(error, 500));
        }
    }
    async resetPassword(req, res, next) {
        const updatedUser = await this.authService.ResetPassword(req.body);
        const options = {
            toMail: updatedUser.get('email'),
            username: updatedUser.get('fullname').split(' ')[ 0 ],
        };
        const isSuccess = await this.mailerService.sendPasswordConfirmEmail(options);
        if(isSuccess){
            return res.status(200).json({ 
                success: true,
                message: 'Password Reset Successfully!',
            });
        } else {
            return next(new AppError('There was an error sending mail. Please try again later', 500));
        }
    }
}
