import hbs from 'nodemailer-express-handlebars';
import nodemailer from 'nodemailer';
import path from 'path';
const handlebarsOptions = {
    viewEngine: {
        extName: '.html',
        partialsDir: path.resolve('./templates'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./templates'),
    extName: '.html',
};
export default class MailerService {
    constructor({ env, }){
        this.env = env;
        this.smtpTransport = nodemailer.createTransport({
            pool: true,
            host: env.MAILER_HOST,
            port: 587,
            secure: false, 
            auth: {
                user: env.MAILER_EMAIL_ID,
                pass: env.MAILER_PASSWORD,
            },
        });
        this.smtpTransport.use('compile', hbs(handlebarsOptions));
        this.sendPasswordConfirmEmail = this.sendPasswordConfirmEmail.bind(this);
        this.sendPasswordResetEmail = this.sendPasswordResetEmail.bind(this);
    }
    async sendPasswordResetEmail(options){
        let { toMail, origin, token, username, } = options;
        const data = {
            to: toMail,
            from: this.env.MAILER_EMAIL_ID,
            template: 'forgot-password-email',
            subject: 'Password help has arrived!',
            context: {
                url: `${origin}/reset_password?token=${token}`,
                name: username,
            },
        };
        const mail = await this.smtpTransport.sendMail(data);
        if(mail.accepted.length){
            return true;
        }
        return false;
    }
    async sendPasswordConfirmEmail(options){
        let { toMail, username, } = options;
        const data = {
            to: toMail,
            from: this.env.MAILER_EMAIL_ID,
            template: 'reset-password-email',
            subject: 'Password Reset Confirmation',
            context: {
                name: username,
            },
        };
        const mail = await this.smtpTransport.sendMail(data);
        if(mail.accepted.length){
            return true;
        }
        return false;
    }
}
