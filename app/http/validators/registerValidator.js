import Joi from 'joi';
const RegistervalidateScheama = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmpassword: Joi.valid(Joi.ref('password')),
});
export default RegistervalidateScheama;
