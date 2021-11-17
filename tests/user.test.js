import app from '../server'
import request from 'supertest'
test('should register a user', async () => {
    const req = await request(app).post('/api/register').send({
        fullname: 'Labham Jain',
        email: 'myemail@gmail.com',
        password: 'abcd1234',
        confirmpassword: 'abcd1234',
    })
    expect(req.status).toBe(200)
})
