require('esm')(module);
import MailerService from '../../services/mailerService';
const env = {
    MAILER_HOST: 'test',
    MAILER_EMAIL_ID: 'some_email',
    MAILER_PASSWORD: 'some_secret',
    authEmail: 'some_email',
};
describe('Mailer Service Tests', function () {
    it('should send password reset mail', async (done) => {
        const options = {
            toMail: 'some_mail',
            origin: 'origin',
            token: 'token',
            username: 'username',
        };
        const mailerService = new MailerService({ env: env, });
        const data = await mailerService.sendPasswordResetEmail(options);
        expect(data).toBeDefined();
        expect(data).toBe(true);
        done();
    });
    it('should send password confirmation mail', async (done) => {
        const options = {
            toMail: 'some_mail',
            username: 'username',
        };
        const mailerService = new MailerService({ env: env, });
        const data = await mailerService.sendPasswordConfirmEmail(options);
        expect(data).toBeDefined();
        expect(data).toBe(true);
        done();
    });
});
