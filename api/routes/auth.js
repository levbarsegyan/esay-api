import { Router } from 'express';
import * as authController from '../../controllers/authController/authController';
import * as passwordController from '../../controllers/authController/passwordController';
import * as passwordValidator from '../../validators/passwordValidator';
import loginValidator from '../../validators/loginValidator';
import registerValidator from '../../validators/registerValidator';
import { celebrate } from 'celebrate';
const route = Router();
export default (app) => {
    app.use('/auth', route);
    route.post('/register', celebrate({ body: registerValidator, }), authController.register);
    route.post('/login', celebrate({ body: loginValidator, }), authController.login);
    route.get('/oauth/redirect/github', authController.githubAuthRedirect);
    route.post('/oauth/signin/github', authController.githubAuth);
    route.get('/oauth/redirect/google',  authController.googleRedirect);
    route.post('/oauth/signin/google',  authController.googleAuth);
    route.post('/forgot_password', celebrate({ body: passwordValidator.ForgotPasswordvalidateScheama, }), passwordController.forgotPassword);
    route.post('/reset_password', celebrate({ body: passwordValidator.ResetPasswordvalidateScheama, }), passwordController.resetPassword);
};
