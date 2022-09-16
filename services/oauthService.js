import got from 'got';
import urls from '../config/urls';
export default class OAuthService {
    async GitHubAuth(code) {
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
        return {
            fullname: username ? username : 'github user',
            userid: getuser.id,
            email: getuserEmail[ 0 ].email,
            provider: 'github auth',
        };
    }
    async GoogleAuth(code) {
        let { body, } = await got.post(`${urls.googleAuth.getTokenUrl}&code=${code}`).catch((e) => console.log(e));
        body = JSON.parse(body);
        const token = body.access_token;
        let userinfo = await got.get(`${urls.googleAuth.getUserinfoUrl}?access_token=${token}`);
        userinfo = JSON.parse(userinfo.body);
        return {
            fullname: userinfo.name,
            userid: userinfo.sub,
            email: userinfo.email,
            provider: 'google auth',
        };
    }
}
