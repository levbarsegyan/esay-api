import Joi from 'joi'
const RegistervalidateScheama = Joi.object({
    fullname:Joi.string().required().error(()=>{return Error('fullname is required!!!')}),
    email:Joi.string().email().required().error(()=>{return Error('valid email is required!!!')}),
    password:Joi.string().min(8).required().error(()=>{return Error('password should be minimum 8 char long!!!')}),
    confirmpassword:Joi.ref('password'),
})
export default RegistervalidateScheama
