import app from '../server';
import request from 'supertest';
import User from '../app/database/models/User.js';
import db from '../app/database/connection.js';
describe('Auth test api', function () {
    beforeAll(async (done) => {
        await User.sync();
        done();
    });
    afterAll(async (done) => {
        await db.drop();
        await db.close();
        done();
    });
    it('register a user', (done) => {
        request(app)
            .post('/register')
            .send({
                fullname: 'Jhon Doe',
                email: 'myemail@gmail.com',
                password: 'abcd12345',
                confirmpassword: 'abcd12345',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).toHaveProperty('message');
                expect(res.body).toHaveProperty('token');
                expect(res.headers).toHaveProperty('set-cookie');
                done();
            });
    });
    it('login a user', (done) => {
        request(app)
            .post('/login')
            .send({
                email: 'myemail@gmail.com',
                password: 'abcd12345',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).toHaveProperty('message');
                expect(res.body).toHaveProperty('token');
                expect(res.headers).toHaveProperty('set-cookie');
                done();
            });
    });
});
