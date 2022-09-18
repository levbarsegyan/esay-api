import hbs from 'nodemailer-express-handlebars';
import nodemailer from 'nodemailer';
import path from 'path';
const authEmail = process.env.MAILER_EMAIL_ID;
const authPass = process.env.MAILER_PASSWORD;
const host = process.env.MAILER_HOST;
const smtpTransport = nodemailer.createTransport({
    pool: true,
    host: host,
    port: 587,
    secure: false, 
    auth: {
        user: authEmail,
        pass: authPass,
    },
});
smtpTransport.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});
const handlebarsOptions = {
    viewEngine: {
        extName: '.html',
        partialsDir: path.resolve('./templates'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./templates'),
    extName: '.html',
};
smtpTransport.use('compile', hbs(handlebarsOptions));
export default class MailerService {
    async sendPasswordResetEmail(options){
        let { toMail, origin, token, username, } = options;
        const data = {
            to: toMail,
            from: authEmail,
            template: 'forgot-password-email',
            subject: 'Password help has arrived!',
            context: {
                url: `${origin}/reset_password?token=${token}`,
                name: username,
            },
        };
        const mail = await smtpTransport.sendMail(data);
        if(mail.accepted.length){
            return true;
        }
        return false;
    }
    async sendPasswordConfirmEmail(options){
        let { toMail, username, } = options;
        const data = {
            to: toMail,
            from: authEmail,
            template: 'reset-password-email',
            subject: 'Password Reset Confirmation',
            context: {
                name: username,
            },
        };
        const mail = await smtpTransport.sendMail(data);
        if(mail.accepted.length){
            return true;
        }
        return false;
    }
}
