import Joi from 'joi'
const LoginvalidateScheama = Joi.object({
    email: Joi.string().email().required().error(() => Error('valid email is required!!!')),
    password: Joi.string().required().error(() => Error('password is required!!!')),
})
export default LoginvalidateScheama
