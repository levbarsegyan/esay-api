import RegisterUserSchema from './JoiSchema/registerUser';
import LoginUserSchema from './JoiSchema/loginUser';
import * as PasswordSchema from './JoiSchema/forgotPassword';
const validateRequest = (req, next, schema) => {
    const options = {
        abortEarly: false, 
        allowUnknown: true, 
        stripUnknown: true, 
    };
    const { error, value, } = schema.validate(req.body, options);
    if (error) {
        next(error);
    } else {
        req.body = value;
        next();
    }
};
const validateRegisterUserSchema = (req, res, next) => {
    validateRequest(req, next, RegisterUserSchema);
};
const validateLoginUserSchema = (req, res, next) => {
    validateRequest(req, next, LoginUserSchema);
};
const validateResetPasswordSchema = (req, res, next) => {
    validateRequest(req, next, PasswordSchema.ResetPasswordSchema);
};
const validateForgotPasswordSchema = (req, res, next) => {
    validateRequest(req, next, PasswordSchema.ForgotPasswordSchema);
};
export { validateRegisterUserSchema, validateLoginUserSchema, validateForgotPasswordSchema, validateResetPasswordSchema };
