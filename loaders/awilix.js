import { createContainer, asClass, asValue, InjectionMode, asFunction } from 'awilix';
import AuthController from '../controllers/authController/authController';
import * as PasswordController from '../controllers/authController/passwordController';
import AuthService from '../services/authService';
import MailerService from '../services/mailerService';
import OAuthService from '../services/oauthService';
import UserModel from '../models/User';
import AppError from '../utils/appError';
const container = createContainer({
    injectionMode: InjectionMode.PROXY,
});
const setup = () => {
    container.register({
        AuthController: asClass(AuthController),
        AuthService: asClass(AuthService),
        MailerService: asClass(MailerService),
        OAuthService: asClass(OAuthService),
        AppError: asClass(AppError),
        UserModel: asValue(UserModel),
    });
};
export {
    container,
    setup
};
