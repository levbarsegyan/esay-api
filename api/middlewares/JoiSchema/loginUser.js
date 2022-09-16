import Joi from 'joi';
const LoginUserSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    remember: Joi.boolean().required(),
});
export default LoginUserSchema;
