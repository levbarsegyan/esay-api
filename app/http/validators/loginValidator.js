import Joi from 'joi';
const LoginvalidateScheama = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    remember: Joi.boolean().required(),
});
export default LoginvalidateScheama;
