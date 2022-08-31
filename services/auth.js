import bcrypt from 'bcrypt';
import AppError from '../utils/appError';
import jwt from 'jsonwebtoken';
export default class AuthService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async Signup(userData, next) {
        let { fullname, email, password } = userData;
        email = email.trim();
        const user = await this.userModel.findAll({ where: { email } });
        if (user.length) {
            return next(new AppError('User already exists', 409));
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            try {
                await this.userModel.create({
                    fullname,
                    email,
                    password: hashedPassword,
                });
                return this.generateToken(email);
            } catch (error) {
                return next(new AppError('Something went wrong', 500));
            }
        }
    }
    async Signin(userData, next) {
        const { email, password } = userData;
        const user = await this.userModel.findAll({ where: { email } });
        if (user.length > 0) {
            const encryptPass = user[0].dataValues.password;
            const comp = await bcrypt.compare(password, encryptPass);
            if (comp) {
                return this.generateToken(email);
            } else {
                return next(new AppError('Incorrect E-mail or password', 401));
            }
        } else {
            return next(new AppError('User does not exists', 404));
        }
    }
    generateToken(email) {
        return jwt.sign({ email }, process.env.tokensecret, {
            expiresIn: '1H',
        });
    }
}
