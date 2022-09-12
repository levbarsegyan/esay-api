import bcrypt from 'bcrypt';
import catchAsync from './../../utils/catchAsync';
import AppError from './../../utils/appError.js';
import sendToken from './../../utils/sendToken.js';
import registerValidator from './../../validators/registerValidator.js';
import loginValidator from './../../validators/loginValidator.js';
import UserModel from './../../database/models/User.js'; 
const register = catchAsync(async(req, res, next)=>{
    let { fullname, email, password, remember, } = req.body;
    email = email.trim();
    await registerValidator.validateAsync({ fullname, email, password, remember, });
    const user = await UserModel.findAll({ where: { email, }, });
    console.log(user);
    if (user.length){
        return next(new AppError('User already exists', 409));
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            await UserModel.create({
                fullname,
                email,
                password: hashedPassword,
            });
            sendToken(email, remember, 'You are registered successfully.', res);
        } catch (error) {
            return next(new AppError('Something went wrong', 500));
        }
    }
});
const login = catchAsync(async(req, res, next)=>{
    const { email, password, remember, } = req.body;
    await loginValidator.validateAsync({ email, password, remember, });
    const user = await UserModel.findAll({ where: { email, }, });
    if(user.length > 0){
        const incriptPass = user[ 0 ].dataValues.password;
        const comp = await bcrypt.compare(password, incriptPass);
        if(comp){
            sendToken(email, remember, 'logged in successfully!!!', res);
        }
        else{
            return next(new AppError('Incorrect E-mail or password', 401));
        }
    }
    else{
        return next(new AppError('User does not exists', 404));
    }
});
export { register, login };
