require('esm')(module);
import express from 'express';
import loaders from '../loaders';
import request from 'supertest';
import User from '../models/User.js';
import { db } from '../loaders/sequelize';
import crypto from 'crypto';
const app = express();
describe('Auth test api', function () {
    beforeAll(async (done) => {
        await loaders({ expressApp: app, });
        await User.sync();
        done();
    });
    afterAll(async (done) => {
        await db.drop();
        done();
    });
    it('register a user', (done) => {
        request(app)
            .post('/api/auth/register')
            .send({
                fullname: 'Jhon Doe',
                email: 'myemail@gmail.com',
                password: 'abcd12345',
                confirmpassword: 'abcd12345',
                remember: true,
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).toHaveProperty('success');
                expect(res.body).toHaveProperty('message');
                expect(res.body).toHaveProperty('token');
                done();
            });
    });
    it('login a user', (done) => {
        request(app)
            .post('/api/auth/login')
            .send({
                email: 'myemail@gmail.com',
                password: 'abcd12345',
                remember: true,
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body).toHaveProperty('success');
                expect(res.body).toHaveProperty('message');
                expect(res.body).toHaveProperty('token');
                done();
            });
    });
    it('should send email for reset password link', (done) => {
        const mockToken = jest
            .spyOn(crypto, 'randomBytes')
            .mockReturnValue('some_random_bytes');
        request(app)
            .post('/api/auth/forgot_password')
            .send({
                email: 'myemail@gmail.com',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('success');
                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toBe(
                    'Kindly check your email for further instructions'
                );
                expect(mockToken).toHaveBeenCalled();
                jest.spyOn(crypto, 'randomBytes').mockRestore();
                done();
            });
    });
    it('should reset password', (done) => {
        request(app)
            .post('/api/auth/reset_password')
            .send({
                token: 'some_random_bytes',
                newPassword: 'new_password',
                verifyPassword: 'new_password',
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
            .post('/api/auth/login')
            .send({
                email: 'myemail@gmail.com',
                password: 'new_password',
                remember: 'true',
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
