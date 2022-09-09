import Joi from 'joi';
const RegisterUserSchema = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmpassword: Joi.valid(Joi.ref('password')).error(() => Error('New password and confirm password does not match!')),
    remember: Joi.boolean().required(),
});
export default RegisterUserSchema;
