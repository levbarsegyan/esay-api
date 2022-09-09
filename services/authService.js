import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import Sequelize from 'sequelize';
const Op = Sequelize.Op;
const TWELVE_HOUR_IN_MILLISECONDS = 12 * 60 * 60 * 1000;
const oldDateObj = new Date();
const newDateObj = new Date();
const expiryTime = newDateObj.setTime(oldDateObj.getTime() + TWELVE_HOUR_IN_MILLISECONDS);
export default class AuthService {
    constructor(userModel, AppError) {
        this.userModel = userModel;
        this.AppError = AppError;
    }
    async Signup(userData) {
        let { fullname, email, password, userid, provider, } = userData;
        email = email.trim();
        const user = await this.userModel.findAll({ where: { email, }, });
        if (user.length) {
            if (provider) {
                return this.generateJWTToken(email);
            } else {
                throw (new this.AppError('User already exists', 409));
            }
        } else {
            try {
                if(provider){
                    await this.userModel.create({
                        fullname,
                        email,
                        userid,
                        provider,
                    });
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    await this.userModel.create({
                        fullname,
                        email,
                        password: hashedPassword,
                    });
                }
                return this.generateJWTToken(email);
            } catch (error) {
                throw (new this.AppError('Something went wrong', 500));
            }
        }
    }
    async Signin(userData) {
        const { email, password, } = userData;
        const user = await this.userModel.findAll({ where: { email, }, });
        if (user.length > 0) {
            const encryptPass = user[ 0 ].dataValues.password;
            const isPasswordMatch = await bcrypt.compare(password, encryptPass);
            if (isPasswordMatch) {
                return this.generateJWTToken(email);
            } else {
                throw (new this.AppError('Incorrect E-mail or password', 401));
            }
        } else {
            throw (new this.AppError('User does not exists', 404));
        }
    }
    async ForgotPassword(email){
        const user = await this.userModel.findOne({ where: { email: email, }, });
        if(!user){
            throw (new this.AppError('No user exists with this email-address', 404));
        }
        try {
            const token = this.generateRandomToken();
            await this.userModel.update({ reset_password_token: token, reset_password_expires: expiryTime, }, {
                where: {
                    email: email,
                },
            });
            return { user, token, };
        } catch (error) {
            throw (new this.AppError('Something went wrong!', 500));
        }
    }
    async ResetPassword(data){
        const user = await this.userModel.findOne({
            where: {
                reset_password_token: data.token,
                reset_password_expires: {
                    [ Op.gt ]: new Date(),
                },
            },
        });
        if(!user){
            throw (new this.AppError('Password reset token is invalid or has expired.', 401));
        }
        let values = {
            password: bcrypt.hashSync(data.newPassword, 10),
            reset_password_token: null,
            reset_password_expires: null,
        };
        try {
            return await user.update(values);
        } catch (error) {
            throw (new this.AppError('Something went wrong', 500));
        }
    }
    generateRandomToken() {
        return crypto.randomBytes(20).toString('hex');
    }
    generateJWTToken(email) {
        return jwt.sign({ email, }, process.env.tokensecret, {
            expiresIn: '1H',
        });
    }
}
