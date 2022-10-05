import got from 'got';
import urls from '../config/urls';
import AppError from '../utils/appError';
export default class OAuthService {
    constructor({ env, }){
        this.urls = urls(env);
    }
    async GitHubAuth(code) {
        const response = await got.post(`${this.urls.githubAuth.getTokenUrl}&code=${code}`, { headers: { accept: 'application/json', }, });
        const accessToken = JSON.parse(response.body).access_token;
        let getuser = await got.get(this.urls.githubAuth.getUserinfoUrl, {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });
        getuser = JSON.parse(getuser.body);
        let getuserEmail = await got.get(this.urls.githubAuth.getUserEmailUrl, {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });
        getuserEmail = JSON.parse(getuserEmail.body);
        const username = getuser.name;
        return {
            fullname: username ? username : 'github user',
            userid: getuser.id,
            email: getuserEmail[ 0 ].email,
            provider: 'github auth',
        };
    }
    async GoogleAuth(code) {
        let { body, } = await got.post(`${this.urls.googleAuth.getTokenUrl}&code=${code}`).catch((e) => new AppError(e));
        body = JSON.parse(body);
        const token = body.access_token;
        let userinfo = await got.get(`${this.urls.googleAuth.getUserinfoUrl}?access_token=${token}`);
        userinfo = JSON.parse(userinfo.body);
        return {
            fullname: userinfo.name,
            userid: userinfo.sub,
            email: userinfo.email,
            provider: 'google auth',
        };
    }
}
