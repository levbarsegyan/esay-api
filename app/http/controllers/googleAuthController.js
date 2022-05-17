import got from 'got';
import UserModel from '../../database/models/User.js';
import jwt from 'jsonwebtoken';
import urls from '../../../config/urls.js';
const googleAuthController = () => {
    return {
        googleRedirect (req, res) {
            res.redirect(urls.googleAuth.googleAuthScreenUrl);
        },
        async googleauth (req, res) {
            const code = req.body.code;
            let { body, } = await got.post(`${urls.googleAuth.getTokenUrl}&code=${code}`).catch((e) => console.log(e));
            body = JSON.parse(body);
            let token = body.access_token;
            let userinfo = await got.get(`${urls.googleAuth.getUserinfoUrl}?access_token=${token}`);
            userinfo = JSON.parse(userinfo.body);
            const username = userinfo.name;
            const email = userinfo.email;
            const userid = userinfo.sub;
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
                const token = jwt.sign({ email, }, process.env.tokensecret, { expiresIn: '1H', });
                const fourteenDaysToSeconds = 24 * 60 * 60 * 14;
                res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Max-Age=${fourteenDaysToSeconds}`);
                res.setHeader('Access-Control-Allow-Credentials', 'true');
                return res.status(200).json({ message: 'sign in successfully!!!', });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'something went wrong', });
            }
        },
    };
};
export default googleAuthController;
