import app from '../server';
import request from 'supertest';
import User from '../app/database/models/User';
import db from '../app/database/connection';
import crypto from 'crypto';
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
    it('should register a user', (done) => {
        request(app)
            .post('/register')
            .send({
                fullname: 'Jhon Doe',
                email: 'jhonedoe@gmail.com',
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
    it('should login a user', (done) => {
        request(app)
            .post('/login')
            .send({
                email: 'jhonedoe@gmail.com',
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
    it('should send email for reset password link', (done) => {
        const mockToken = jest.spyOn(crypto, 'randomBytes').mockReturnValue('some_random_bytes');
        request(app)
            .post('/forgot_password')
            .send({  
                email: 'jhonedoe@gmail.com',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe('Kindly check your email for further instructions');
                expect(mockToken).toHaveBeenCalled();
                jest.spyOn(crypto, 'randomBytes').mockRestore();
                done();
            });
    });
    it('should reset password', (done) => {
        request(app)
            .post('/reset_password')
            .send({
                'token': 'some_random_bytes',
                'newPassword': 'new_password',
                'verifyPassword': 'new_password',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe('Password Reset Successfully!');
                done();
            });
    });
    it('should login again with new password', (done) => {
        request(app)
            .post('/login')
            .send({
                email: 'jhonedoe@gmail.com',
                password: 'new_password',
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
