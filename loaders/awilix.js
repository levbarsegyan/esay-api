import { createContainer, asClass, asValue, InjectionMode } from 'awilix';
import AuthController from '../controllers/authController/authController';
import PasswordController from '../controllers/authController/passwordController';
import AuthService from '../services/authService';
import MailerService from '../services/mailerService';
import OAuthService from '../services/oauthService';
import UserModel from '../models/User';
const container = createContainer({
    injectionMode: InjectionMode.PROXY,
});
const setup = () => {
    container.register({
        AuthController: asClass(AuthController),
        PasswordController: asClass(PasswordController),
        AuthService: asClass(AuthService),
        MailerService: asClass(MailerService),
        OAuthService: asClass(OAuthService),
        UserModel: asValue(UserModel),
    });
};
export {
    container,
    setup
};
