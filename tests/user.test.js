import app from '../server'
import request from 'supertest'
import User from '../app/database/models/User.js'
import db from '../app/database/connection.js'
describe('Auth test api', function () {
    beforeAll(async (done) => {
        await User.sync()
        done()
    })
    afterAll(async (done) => {
        await db.drop()
        done()
    })
    it('register a user', (done) => {
        request(app)
            .post('/api/register')
            .send({
                fullname: 'Jhon Doe',
                email: 'myemail@gmail.com',
                password: 'abcd12345',
                confirmpassword: 'abcd12345',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err)
                expect(res.body).toHaveProperty('msg')
                expect(res.body).toHaveProperty('token')
                done()
            })
    })
    it('login a user', (done) => {
        request(app)
            .post('/api/login')
            .send({
                email: 'myemail@gmail.com',
                password: 'abcd1234',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err)
                expect(res.body).toHaveProperty('msg')
                expect(res.body).toHaveProperty('token')
                done()
            })
    })
})
