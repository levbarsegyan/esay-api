require('esm')(module);
import User from '../../models/User';
import { db } from '../../loaders/sequelize';
import OAuthService from '../../services/oauthService';
describe('OAuth Service Tests', function () {
    beforeAll(async (done) => {
        await User.sync();
        done();
    });
    afterAll(async (done) => {
        await db.drop();
        done();
    });
    it('should register user using GitHubAuth', async (done) => {
        const env = {
            GOOGLE_CLIENT_ID: 'GOOGLE_CLIENT_ID',
            GOOGLE_CLIENT_SECRET: 'GOOGLE_CLIENT_SECRET',
            GITHUB_CLIENT: 'GITHUB_CLIENT',
            GITHUB_TOKEN: 'GITHUB_TOKEN',
        };
        const code = 'XXXXXX';
        const oauthService = new OAuthService({ env, });
        const data = await oauthService.GitHubAuth(code);
        expect(data).toBeDefined();
        expect(data).toHaveProperty('fullname');
        expect(data).toHaveProperty('userid');
        expect(data).toHaveProperty('email');
        expect(data).toHaveProperty('provider');
        expect(data.provider).toBe('github auth');
        done();
    });
    it('should register user using GoogleAuth', async (done) => {
        const env = {
            GOOGLE_CLIENT_ID: 'GOOGLE_CLIENT_ID',
            GOOGLE_CLIENT_SECRET: 'GOOGLE_CLIENT_SECRET',
            GITHUB_CLIENT: 'GITHUB_CLIENT',
            GITHUB_TOKEN: 'GITHUB_TOKEN',
        };
        const code = 'XXXXXX';
        const oauthService = new OAuthService({ env, });
        const data = await oauthService.GoogleAuth(code);
        expect(data).toBeDefined();
        expect(data).toHaveProperty('fullname');
        expect(data).toHaveProperty('userid');
        expect(data).toHaveProperty('email');
        expect(data).toHaveProperty('provider');
        expect(data.provider).toBe('google auth');
        done();
    });
});
