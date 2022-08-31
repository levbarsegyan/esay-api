import catchAsync from './../../utils/catchAsync';
import UserModel from '../../models/User.js';
import AuthService from '../../services/auth';
const FOURTEEN_DAYS_IN_MILLISECONDS = 24 * 60 * 60 * 14 * 1000;
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
};
const register = catchAsync(async (req, res, next) => {
    const isRemember = req.body.remember;
    const authServiceInstance = new AuthService(UserModel);
    const token = await authServiceInstance.Signup(req.body, next);
    if(isRemember){
        cookieOptions.maxAge = FOURTEEN_DAYS_IN_MILLISECONDS;
    } else{
        cookieOptions.maxAge = 0;
    }
    res.cookie('token', token, cookieOptions);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    const message = 'Registered successfuly!';
    return res.status(200).json({
        success: true,
        message,
        token,
    });
});
const login = catchAsync(async (req, res, next) => {
    const isRemember = req.body.remember;
    const authServiceInstance = new AuthService(UserModel);
    const token = await authServiceInstance.Signin(req.body, next);
    if(isRemember){
        cookieOptions.maxAge = FOURTEEN_DAYS_IN_MILLISECONDS;
    } else{
        cookieOptions.maxAge = 0;
    }
    res.cookie('token', token, cookieOptions);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    const message = 'Logged successfuly!';
    return res.status(200).json({
        success: true,
        message,
        token,
    });
});
export { register, login };
