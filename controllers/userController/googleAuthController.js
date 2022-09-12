import got from 'got';
import catchAsync from './../../utils/catchAsync';
import AppError from './../../utils/appError.js';
import sendToken from './../../utils/sendToken.js';
import UserModel from './../../database/models/User.js'; 
import urls from './../../config/urls';
const googleRedirect = (req, res)=>{
    return res.redirect(urls.googleAuth.googleAuthScreenUrl);
};
const googleAuth = catchAsync(async(req, res, next)=>{
    const code = req.query.code;
    let { body, } = await got.post(`${urls.googleAuth.getTokenUrl}&code=${code}`).catch((e) => console.log(e));
    body = JSON.parse(body);
    let token = body.access_token;
    let userinfo = await got.get(`${urls.googleAuth.getUserinfoUrl}?access_token=${token}`);
    userinfo = JSON.parse(userinfo.body);
    const username = userinfo.name;
    const email = userinfo.email;
    const userid = userinfo.sub;
    const remember = true;
    try {
        const isUserExist = await UserModel.findAll({ where: { userid: userid.toString(), }, });
        if (isUserExist.length == 0) {
            await UserModel.create({
                fullname: username,
                email,
                userid,
                provider: 'google auth',
            });
        }
        sendToken(email, remember, 'You are registered successfully.', res);
    } catch (error) {
        console.log(error);
        return next(new AppError('Something went wrong.', 500));
    }
});
export { googleRedirect, googleAuth };
