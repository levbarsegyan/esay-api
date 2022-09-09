import Joi from 'joi';
const ResetPasswordSchema = Joi.object().keys({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
    verifyPassword: Joi.valid(Joi.ref('newPassword')).required().error(() => Error('New password and verify password does not match!')),
});
const ForgotPasswordSchema = Joi.object().keys({
    email: Joi.string().email().required(),
});
export { ResetPasswordSchema, ForgotPasswordSchema };
