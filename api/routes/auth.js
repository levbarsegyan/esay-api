import { Router } from 'express';
import * as authController from '../../controllers/authController/authController';
import * as passwordController from '../../controllers/authController/passwordController';
import * as schemaValidator from '../middlewares/schemaValidator';
const route = Router();
export default (app) => {
    app.use('/auth', route);
    route.post('/register', schemaValidator.validateRegisterUserSchema, authController.register);
    route.post('/login', schemaValidator.validateLoginUserSchema, authController.login);
    route.get('/oauth/redirect/github', authController.githubAuthRedirect);
    route.post('/oauth/signin/github', authController.githubAuth);
    route.get('/oauth/redirect/google',  authController.googleRedirect);
    route.post('/oauth/signin/google',  authController.googleAuth);
    route.post('/forgot_password', schemaValidator.validateForgotPasswordSchema, passwordController.forgotPassword);
    route.post('/reset_password', schemaValidator.validateResetPasswordSchema, passwordController.resetPassword);
};
