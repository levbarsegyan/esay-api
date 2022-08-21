import got from 'got';
import catchAsync from './../../utils/catchAsync';
import AppError from './../../utils/appError.js';
import sendToken from './../../utils/sendToken.js';
import UserModel from './../../database/models/User.js'; 
import urls from './../../config/urls';
const githubAuthRedirect = catchAsync(async (req, res) => {
    return res.redirect(urls.githubAuth.GithubAuthScreenUrl);
});
const githubAuth = catchAsync(async (req, res, next) => {
    const { code, } = req.body;
    const response = await got.post(`${urls.githubAuth.getTokenUrl}&code=${code}`, { headers: { accept: 'application/json', }, });
    const accessToken = JSON.parse(response.body).access_token;
    let getuser = await got.get(urls.githubAuth.getUserinfoUrl, {
        headers: {
            Authorization: `token ${accessToken}`,
        },
    });
    getuser = JSON.parse(getuser.body);
    let getuserEmail = await got.get(urls.githubAuth.getUserEmailUrl, {
        headers: {
            Authorization: `token ${accessToken}`,
        },
    });
    getuserEmail = JSON.parse(getuserEmail.body);
    const username = getuser.name;
    const userid = getuser.id;
    const email = getuserEmail[ 0 ].email;
    const remember = true;
    try {
        const isUserExist = await UserModel.findAll({ where: { userid: userid.toString(), }, });
        if (isUserExist.length == 0) {
            await UserModel.create({
                fullname: username ? username : 'github user',
                email,
                userid,
                provider: 'github auth',
            });
        }
        sendToken(email, remember, 'Signed in successfully.', res);
    } catch (error) {
        next(new AppError('Internal server error', 500));
    }
});
export { githubAuth, githubAuthRedirect };
