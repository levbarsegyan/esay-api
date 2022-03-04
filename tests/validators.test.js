import app from '../server'
import request from 'supertest'
import User from '../app/database/models/User.js'
import db from '../app/database/connection.js'
describe('Register validator tests', () => {
    beforeAll(async (done) => {
        await User.sync()
        done()
    })
    afterAll(async (done) => {
        await db.drop()
        done()
    })
    it('register validator should throw error if fullname is not present', (done) => {
        request(app)
            .post('/register')
            .send({
                fullname: '',
                email: 'myemail@gmail.com',
                password: '12345678',
                confirmpassword: '12345678',
            })
            .set('Accept', 'application/json')
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err)
                expect(res.body).toMatchObject({ 'error': 'fullname is required!!!', })
                done()
            })
    })
    it('register validator should throw error if email is not valid', (done) => {
        request(app)
            .post('/register')
            .send({
                fullname: 'John Doe',
                email: '',
                password: '12345678',
                confirmpassword: '12345678',
            })
            .set('Accept', 'application/json')
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err)
                expect(res.body).toMatchObject({ 'error': 'valid email is required!!!', })
                done()
            })
    })
    it('register validator should throw error if password is not present', (done) => {
        request(app)
            .post('/register')
            .send({
                fullname: 'John Doe',
                email: 'myemail@gmail.com',
                password: '',
                confirmpassword: '12345678',
            })
            .set('Accept', 'application/json')
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err)
                expect(res.body).toMatchObject({ 'error': 'password should be minimum 8 char long!!!', })
                done()
            })
    })
    it('register validator should throw error if confirmpassword not matching password', (done) => {
        request(app)
            .post('/register')
            .send({
                fullname: 'John Doe',
                email: 'myemail@gmail.com',
                password: '12345678',
                confirmpassword: '',
            })
            .set('Accept', 'application/json')
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err)
                expect(res.body).toMatchObject({ 'error': 'New password and confirm password do not match!', })
                done()
            })
    })
    it('register validator should validate properly if all fields are proper', (done) => {
        request(app)
            .post('/register')
            .send({
                fullname: 'John Doe',
                email: 'myemail@gmail.com',
                password: 'abcd12345',
                confirmpassword: 'abcd12345',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err)
                expect(res.body).toHaveProperty('msg')
                expect(res.body).toHaveProperty('token')
                done()
            })
    })
    it('login validator should throw error if email is not present', (done) => {
        request(app)
            .post('/login')
            .send({
                email: '',
                password: '12345678',
            })
            .set('Accept', 'application/json')
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err)
                expect(res.body).toMatchObject({ 'error': 'valid email is required!!!', })
                done()
            })
    })
    it('login validator should throw error if password is not present', (done) => {
        request(app)
            .post('/login')
            .send({
                email: 'myemail@gmail.com',
                password: '',
            })
            .set('Accept', 'application/json')
            .expect(400)
            .end(function(err, res) {
                if (err) return done(err)
                expect(res.body).toMatchObject({ 'error': 'password is required!!!', })
                done()
            })
    })
    it('login validator should validate properly if all fields are proper', (done) => {
        request(app)
            .post('/login')
            .send({
                email: 'myemail@gmail.com',
                password: 'abcd12345',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err)
                expect(res.body).toHaveProperty('msg')
                expect(res.body).toHaveProperty('token')
                done()
            })
    })
})
