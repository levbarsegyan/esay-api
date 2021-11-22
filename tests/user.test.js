process.env.NODE_ENV = 'test'
import app from '../server'
import request from 'supertest'
import connection from '../app/database/connection.js'
import assert from 'assert'
var token = ''
beforeAll(async done => {  
    const client = await connection()
    app.set('db', client)
    global.__DB__ = client
    await client.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY NOT NULL, 
        fullname TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        is_verified BOOLEAN DEFAULT false
        )`)
    done()
})
afterAll(async done => {
    const db = global.__DB__
    await db.query('DROP TABLE users')
    await db.end()
    done()
})
describe('POST /api/register', () => {
    it('it should register a user', async done => {
        return request(app)
            .post('/api/register')
            .send({
                fullname: 'Jhon Doe',
                email: 'myemail@gmail.com',
                password: 'abcd1234',
                confirmpassword: 'abcd1234',
            })
            .expect(200)
            .then(response => {
                expect(response.body).toHaveProperty('msg')
                expect(response.body).toHaveProperty('token')
                token = response.body.token
                done()
            })
            .catch(err => done(err))
    }) 
})
describe('POST /api/login', () => {
    it('it should login a user', async done => {
        return request(app)
            .post('/api/login')
            .send({
                email: 'myemail@gmail.com',
                password: 'abcd1234',
            })
            .then(response => {
                expect(response.body).toHaveProperty('msg')
                expect(response.body).toHaveProperty('token')
                assert(response.body.token, token)
                done()
            })
            .catch(err => done(err))
    })
})
