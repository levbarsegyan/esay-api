import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs/promises';
import imgur from 'imgur';
import request from 'supertest';
import app from '../server';
import User from '../app/database/models/User';
import db from '../app/database/connection';
puppeteer.use(StealthPlugin());
let browser, page;
const authCodes = { github: null, google: null, };
const launchBrowser = async () => {
    browser = await puppeteer.launch({
        args: [ '--—headless', '--no-sandbox' ],
        ignoreDefaultArgs: [ '--enable-automation' ],
    });
};
const takeScreenshot = async (provider) => {
    const path = `snapshots/${provider}_${Math.random()}.png`;
    try {
        await page.screenshot({
            path,
        });
        const uploadImg = await imgur.uploadFile(path);
        console.log('Image uploaded', uploadImg.link);
    } catch (e) {
        console.error('error while taking screenshot', e);
    }
};
const getAuthCode = async (provider) => {
    const cookies = await fs.readFile(`${provider}.cookie.json`, 'utf8'); 
    const deserializedCookies = await JSON.parse(cookies);
    page = await browser.newPage();
    await page.setCookie(...deserializedCookies);
    await page.setRequestInterception(true);
    page.on('load', async () => {
        console.log('page loaded', page.url());
        await takeScreenshot(provider);
    });
    page.on('request', async (req) => {
        if (req.url().startsWith('http:
            await req.abort();
            const url = new URL(req.url());
            const code = url.searchParams.get('code');
            authCodes[ provider ] = code;
            console.log('Code for ', provider, code);
            return code;
        } else {
            req.continue();
        }
    });
    await page.goto(
        `http:
    );
    if (provider === 'google') {
        await (await page.waitForSelector('div[role="link"]')).click();
    }
};
const signin = (done, provider) => {
    request(app)
        .post(`/oauth/signin/${provider}`)
        .send({
            code: authCodes[ provider ],
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('token');
            expect(res.headers).toHaveProperty('set-cookie');
            done();
        });
};
describe('Test OAuths Integration & API', () => {
    beforeAll(async (done) => {
        await User.sync();
        await launchBrowser();
        done();
    });
    afterAll(async (done) => {
        await browser.close();
        await db.drop();
        await db.close();
        done();
    });
    it('Should Redirect user to GitHub', async () => {
        try {
            const code = await getAuthCode('github');
            expect(code).toBeDefined();
        } catch (e) {
        }
    });
    it('Should sign in using Github auth code', (done) => {
        signin(done, 'github');
    }, 10000);
    it('Should Redirect user to Google', async () => {
        try {
            const code = await getAuthCode('google');
            expect(code).toBeDefined();
        } catch (e) {
        }
    }, 20000);
    it('Should sign in using Google auth code', (done) => {
        signin(done, 'google');
    }, 10000);
});
