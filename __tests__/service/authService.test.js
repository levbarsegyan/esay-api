require('esm')(module);
import prisma from '../../prisma';
import AuthService from '../../services/authService';
const env = {
    NODE_ENV: 'test',
    tokensecret: 'some_secret',
};
let reset_password_token = '';
describe('Auth Service Tests', function () {
    afterAll(async (done) => {
        await prisma.user.delete({
            where: {
                email: 'realdev_test@mail.com',
            },
        });
        done();
    });
    it('should register user', async (done) => {
        const body = {
            fullname: 'Jhon Doe',
            email: 'realdev_test@mail.com',
            password: 'abcd12345',
            confirmpassword: 'abcd12345',
            remember: true,
        };
        const data = {
            prisma: prisma,
            env: env,
        };
        const authService = new AuthService(data);
        const token = await authService.Signup(body);
        expect(token).toBeDefined();
        done();
    });
    it('should login user', async (done) => {
        const body = {
            email: 'realdev_test@mail.com',
            password: 'abcd12345',
            remember: true,
        };
        const data = {
            prisma: prisma,
            env: env,
        };
        const authService = new AuthService(data);
        const token = await authService.Signin(body);
        expect(token).toBeDefined();
        done();
    });
    it('should return user, token by email in forgot password', async (done) => {
        const email = 'realdev_test@mail.com';
        const data = {
            prisma: prisma,
            env: env,
        };
        const authService = new AuthService(data);
        const { user, token, } = await authService.ForgotPassword(email);
        reset_password_token = token;
        expect(token).toBeDefined();
        expect(user).toBeDefined();
        done();
    });
    it('should return user by reset password', async (done) => {
        const body = {
            token: reset_password_token,
            newPassword: 'newpassword',
            remember: true,
        };
        const data = {
            prisma: prisma,
            env: env,
        };
        const authService = new AuthService(data);
        const user = await authService.ResetPassword(body);
        expect(user).toBeDefined();
        done();
    });
    it('should login user with new password', async (done) => {
        const body = {
            email: 'realdev_test@mail.com',
            password: 'newpassword',
            remember: true,
        };
        const data = {
            prisma: prisma,
            env: env,
        };
        const authService = new AuthService(data);
        const token = await authService.Signin(body);
        expect(token).toBeDefined();
        done();
    });
});
