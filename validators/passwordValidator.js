import Joi from 'joi';
const ResetPasswordvalidateScheama = Joi.object().keys({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
    verifyPassword: Joi.valid(Joi.ref('newPassword')).required(),
});
const ForgotPasswordvalidateScheama = Joi.object().keys({
    email: Joi.string().email().required(),
});
export { ResetPasswordvalidateScheama, ForgotPasswordvalidateScheama };
