import catchAsync from './../../utils/catchAsync';
import AppError from './../../utils/appError';
import UserModel from '../../models/User.js';
import AuthService from '../../services/authService';
import OAuthService from '../../services/oauthService';
import urls from '../../config/urls';
const FOURTEEN_DAYS_IN_MILLISECONDS = 24 * 60 * 60 * 14 * 1000;
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
};
const register = catchAsync(async (req, res, next) => {
    const isRemember = req.body.remember;
    const authServiceInstance = new AuthService(UserModel, AppError);
    const token = await authServiceInstance.Signup(req.body);
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
    const authServiceInstance = new AuthService(UserModel, AppError);
    const token = await authServiceInstance.Signin(req.body);
    if(isRemember){
        cookieOptions.maxAge = FOURTEEN_DAYS_IN_MILLISECONDS;
    } else{
        cookieOptions.maxAge = 0;
    }
    res.cookie('token', token, cookieOptions);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    const message = 'Logged in successfuly!';
    return res.status(200).json({
        success: true,
        message,
        token,
    });
});
const githubAuthRedirect = catchAsync(async (req, res) => {
    return res.redirect(urls.githubAuth.GithubAuthScreenUrl);
});
const githubAuth = catchAsync(async (req, res, next) => {
    const { code, } = req.body;
    const isRemember = true;
    const OAuthServiceInstance = new OAuthService(code);
    const userData = await OAuthServiceInstance.GitHubAuth();
    const authServiceInstance = new AuthService(UserModel, AppError);
    const token = await authServiceInstance.Signup(userData);
    if(isRemember){
        cookieOptions.maxAge = FOURTEEN_DAYS_IN_MILLISECONDS;
    } else{
        cookieOptions.maxAge = 0;
    }
    res.cookie('token', token, cookieOptions);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    const message = 'Logged in successfuly!';
    return res.status(200).json({
        success: true,
        message,
        token,
    });
});
const googleRedirect = (req, res)=>{
    return res.redirect(urls.googleAuth.googleAuthScreenUrl);
};
const googleAuth = catchAsync(async (req, res, next) => {
    const code = req.query.code;
    const isRemember = true;
    const OAuthServiceInstance = new OAuthService(code);
    const userData = await OAuthServiceInstance.GoogleAuth();
    const authServiceInstance = new AuthService(UserModel, AppError);
    const token = await authServiceInstance.Signup(userData);
    if(isRemember){
        cookieOptions.maxAge = FOURTEEN_DAYS_IN_MILLISECONDS;
    } else{
        cookieOptions.maxAge = 0;
    }
    res.cookie('token', token, cookieOptions);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    const message = 'Logged in successfuly!';
    return res.status(200).json({
        success: true,
        message,
        token,
    });
});
export { register, login, githubAuth, githubAuthRedirect, googleAuth, googleRedirect };
