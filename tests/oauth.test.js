import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import request from 'supertest';
import app from '../server';
describe('Test OAuths Integration & API', () => {
    let code;
    test('Redirect user to GitHub', async () => {
        const browser = await puppeteer.launch({
            args: [ '--window-size=1920,1080', '--—headless', '--no-sandbox' ],
            ignoreDefaultArgs: [ '--enable-automation' ],
        });
        try {
            const page = await browser.newPage();
            const pages = await browser.pages();
            if (pages.length > 1) {
                await pages[ 0 ].close();
            }
            await page._client.send('Emulation.clearDeviceMetricsOverride');
            const cookies = await fs.readFile('github.cookie.json', 'utf8'); 
            const deserializedCookies = await JSON.parse(cookies);
            await page.setCookie(...deserializedCookies);
            await page.setRequestInterception(true);
            page.on('request', async (req) => {
                if (req.url().startsWith('http:
                    await req.abort();
                    const url = new URL(req.url());
                    code = url.searchParams.get('code');
                    expect(code).toBeDefined();
                    await browser.close();
                } else {
                    req.continue();
                }
            });
            await page.goto(
                `http:
            );
        } catch (e) {
            await browser.close();
        }
    });
    it('Should signin using Github auth code', (done) => {
        request(app)
            .post('/oauth/signin/github')
            .send({
                code: code,
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).toHaveProperty('msg');
                expect(res.body).toHaveProperty('token');
                done();
            });
    });
});
