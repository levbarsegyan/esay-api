import got from 'got';
import UserModel from '../../database/models/User.js';
import jwt from 'jsonwebtoken';
import urls from '../../../config/urls.js';
const githubAuthController = () => {
    return {
        async githubAuthRedirect(req, res) {
            res.redirect(urls.githubAuth.GithubAuthScreenUrl);
        },
        async githubAuth(req, res) {
            const { code, } = req.body;
            try {
                const response = await got.post(
                    `${urls.githubAuth.getTokenUrl}&code=${code}`,
                    { headers: { accept: 'application/json', }, }
                );
                const accessToken = JSON.parse(response.body).access_token;
                let getuser = await got.get(urls.githubAuth.getUserinfoUrl, {
                    headers: {
                        Authorization: `token ${accessToken}`,
                    },
                });
                getuser = JSON.parse(getuser.body);
                let getuserEmail = await got.get(
                    urls.githubAuth.getUserEmailUrl,
                    {
                        headers: {
                            Authorization: `token ${accessToken}`,
                        },
                    }
                );
                getuserEmail = JSON.parse(getuserEmail.body);
                const username = getuser.name;
                const userid = getuser.id;
                const email = getuserEmail[ 0 ].email;
                try {
                    const isUserExist = await UserModel.findAll({
                        where: { userid: userid.toString(), },
                    });
                    if (isUserExist.length == 0) {
                        await UserModel.create({
                            fullname: username,
                            email,
                            userid,
                            provider: 'github auth',
                        });
                    }
                    const token = jwt.sign({ email, }, process.env.tokensecret, {
                        expiresIn: '1H',
                    });
                    return res
                        .status(200)
                        .json({ msg: 'sign in successfully', token: token, });
                } catch (error) {
                    console.log(error);
                    return res
                        .status(500)
                        .json({ msg: 'something went wrong', });
                }
            } catch (e) {
                console.error(e);
                res.status(401).json({ err: 'invalid code!!!!', });
            }
        },
    };
};
export default githubAuthController;
