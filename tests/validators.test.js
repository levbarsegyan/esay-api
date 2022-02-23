import loginValidator from '../app/http/validators/loginValidator'
import registerValidator from '../app/http/validators/registerValidator'
describe('Login validator tests', () => {
    it('login validator should throw error if email is not present', async (done) => {
        try {
            const testObj = {
                password: '12345678',
            }
            await loginValidator.validateAsync(testObj)
        }catch(err){
            expect(err).toBeTruthy()
            expect(err).toBeInstanceOf(Object)
            done()
        }
    })
    it('login validator should throw error if password is not present', async (done) => {
        try {
            const testObj = {
                email: 'test@gmail.com',
            }
            await loginValidator.validateAsync(testObj)
        }catch(err){
            expect(err).toBeTruthy()
            expect(err).toBeInstanceOf(Object)
            done()
        }
    })
    it('login validator should validate correctly if both fields are proper', (done) => {
        const testObj = {
            email: 'test@gmail.com',
            password: '12345678',
        }
        const res = loginValidator.validate(testObj)
        expect(res).toMatchObject({ value: { email: 'test@gmail.com', password: '12345678', }, })
        done()
    })
})
describe('Register validator tests', () => {
    it('register validator should throw error if fullname is not present', async (done) => {
        try {
            const testObj = {
                fullname: '',
                email: 'test@gmail.com',
                password: '12345678',
                confirmpassword: '12345678',
            }
            await registerValidator.validateAsync(testObj)
        }catch(err){
            expect(err).toBeTruthy()
            expect(err).toBeInstanceOf(Object)
            done()
        }
    })
    it('register validator should throw error if email is not present', async (done) => {
        try {
            const testObj = {
                fullname: 'test',
                email: '',
                password: '12345678',
                confirmpassword: '12345678',
            }
            await registerValidator.validateAsync(testObj)
        }catch(err){
            expect(err).toBeTruthy()
            expect(err).toBeInstanceOf(Object)
            done()
        }
    })
    it('register validator should validate correctly if password is not present', async (done) => {
        try {
            const testObj = {
                fullname: 'test',
                email: 'test@gamil.com',
                password: '',
                confirmpassword: '12345678',
            }
            await registerValidator.validateAsync(testObj)
        }catch(err){
            expect(err).toBeTruthy()
            expect(err).toBeInstanceOf(Object)
            done()
        }
    })
    it('register validator should validate correctly if confirmpassword is not present', async (done) => {
        try {
            const testObj = {
                fullname: 'test',
                email: 'test@gamil.com',
                password: '12345678',
                confirmpassword: '',
            }
            await registerValidator.validateAsync(testObj)
        }catch(err){
            expect(err).toBeTruthy()
            expect(err).toBeInstanceOf(Object)
            done()
        }
    })
    it('register validator should validate correctly if all fields are proper', (done) => {
        const testObj = {
            fullname: 'test',
            email: 'test@gamil.com',
            password: '12345678',
            confirmpassword: '12345678',
        }
        const res = registerValidator.validate(testObj)
        expect(res).toMatchObject({ value: { fullname: 'test',
            email: 'test@gamil.com',
            password: '12345678',
            confirmpassword: '12345678', }, })
        done()
    })
})
