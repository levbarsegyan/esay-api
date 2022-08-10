import Joi from 'joi';
const RegistervalidateScheama = Joi.object({
    fullname: Joi.string().required().error(() => Error('fullname is required!!!')),
    email: Joi.string().email().required().error(() => Error('valid email is required!!!')),
    password: Joi.string().min(8).required().error(() => Error('password should be minimum 8 char long!!!')),
    confirmpassword: Joi.valid(Joi.ref('password')).error(() => Error('New password and confirm password do not match!')),
    remember: Joi.boolean().required(),
});
export default RegistervalidateScheama;
