import { DEBUG_MODE } from '../config/app.js';
import CustomErrorHandler from '../services/CustomErrorHandler.js';
import Joi from 'joi';
const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let data = {
        error: 'Internal server error',
        ...(DEBUG_MODE === 'true' && { originalError: err.message, }),
    };
    if (err instanceof Joi.ValidationError) {
        statusCode = 422;
        data = {
            error: err.message,
        };
    }
    if (err instanceof CustomErrorHandler) {
        statusCode = err.status;
        data = {
            error: err.message,
        };
    }
    return res.status(statusCode).json(data);
};
export default errorHandler;
