import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import AppError from '../utils/appError';
import ERRORS from '../constants/errors';
const TWELVE_HOUR_IN_MILLISECONDS = 12 * 60 * 60 * 1000;
Date.prototype.expiryTime = function() {
    this.setTime(this.getTime() + (TWELVE_HOUR_IN_MILLISECONDS));
    return this;
};
export default class AuthService {
    constructor({ prisma, env, }) {
        this.prisma = prisma;
        this.env = env;
    }
    async Signup(userData) {
        let { fullname, email, password, userid, provider, } = userData;
        email = email.trim();
        const user = await this.prisma.user.findMany({ where: { email, }, });
        if (user.length) {
            if (provider) {
                return this.generateJWTToken(email);
            } else {
                throw (new AppError(ERRORS.USER_EXISTS, 409));
            }
        } else {
            try {
                if(provider){
                    await this.prisma.user.create({
                        data: {
                            fullname,
                            email,
                            userid,
                            provider,
                        },
                    });
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    await this.prisma.user.create({
                        data: {
                            fullname,
                            email,
                            password: hashedPassword,
                        },
                    });
                }
                return this.generateJWTToken(email);
            } catch (error) {
                throw (new AppError(ERRORS.INTERNAL_ERROR, 500));
            }
        }
    }
    async Signin(userData) {
        const { email, password, } = userData;
        const user = await this.prisma.user.findUnique({ where: { email, }, });
        if (user) {
            const encryptPass = user.password;
            const isPasswordMatch = await bcrypt.compare(password, encryptPass);
            if (isPasswordMatch) {
                return this.generateJWTToken(email);
            } else {
                throw (new AppError(ERRORS.INVALID_CREDENTIALS, 401));
            }
        } else {
            throw (new AppError(ERRORS.USER_NOT_FOUND, 404));
        }
    }
    async ForgotPassword(email){
        try {
            const token = this.generateRandomToken();
            const user = await this.prisma.user.update({ where: { email: email, },
                data: { resetPasswordToken: token,
                    resetPasswordExpires: new Date().expiryTime(), },
            });
            return { user, token, };
        } catch (error) {
            if(error.code == 'P2025'){
                throw (new AppError(ERRORS.USER_NOT_FOUND, 404));
            }
            throw (new AppError(ERRORS.INTERNAL_ERROR, 500));
        }
    }
    async ResetPassword(data){
        try {
            let user = await this.prisma.user.findMany({
                where: {
                    AND: [
                        {
                            resetPasswordToken: {
                                equals: data.token,
                            },
                        },
                        { 
                            resetPasswordExpires: {
                                gt: new Date(),
                            },
                        }
                    ],
                },
            });
            if(user.length == 0){
                throw (new AppError(ERRORS.RESET_TOKEN_ERROR, 401));
            }
            user = await this.prisma.user.update({ where: { email: user[ 0 ].email, },
                data: {
                    password: bcrypt.hashSync(data.newPassword, 10),
                    resetPasswordToken: null,
                    resetPasswordExpires: null,
                },
            });
            return user;
        } catch (error) {
            if(error.statusCode == 401){
                throw error;
            }
            throw (new AppError(ERRORS.INTERNAL_ERROR, 500));
        }
    }
    generateRandomToken() {
        return crypto.randomBytes(20).toString('hex');
    }
    generateJWTToken(email) {
        return jwt.sign({ email, }, this.env.tokensecret, {
            expiresIn: '1H',
        });
    }
}
