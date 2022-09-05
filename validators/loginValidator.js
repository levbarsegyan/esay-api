import Joi from 'joi';
const LoginvalidateScheama = Joi.object().keys({
    email: Joi.string().email().required().error(new Error('valid email is required!!!')),
    password: Joi.string().required().error(new Error('password is required!!!')),
    remember: Joi.boolean().required(),
});
export default LoginvalidateScheama;
