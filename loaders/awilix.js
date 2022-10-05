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
const env = {
    MAILER_EMAIL_ID: process.env.MAILER_EMAIL_ID,
    MAILER_PASSWORD: process.env.MAILER_PASSWORD,
    MAILER_HOST: process.env.MAILER_HOST,
    NODE_ENV: process.env.NODE_ENV,
    tokensecret: process.env.tokensecret,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT: process.env.GITHUB_CLIENT,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
};
const setup = () => {
    container.register({
        AuthController: asClass(AuthController),
        PasswordController: asClass(PasswordController),
        AuthService: asClass(AuthService),
        MailerService: asClass(MailerService),
        OAuthService: asClass(OAuthService),
        UserModel: asValue(UserModel),
        env: asValue(env),
    });
};
export {
    container,
    setup
};
