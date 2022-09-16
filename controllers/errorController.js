import { DEBUG_MODE } from '../config/app.js';
import Joi from 'joi';
import AppError from './../utils/appError';
const errorHandler = (err, req, res, next) => {  
    console.log(err);
    let statusCode = 500;
    let data = {
        error: 'Internal server error',
        ...(DEBUG_MODE === 'true' && { originalError: err.message, }),
    };
    if(err instanceof Error) {
        statusCode = err.status;
        data = {
            error: err.message,
        };
    }
    if (err instanceof Joi.ValidationError) {
        statusCode = 422;
        data = {
            error: err.message,
        };
    }
    if (err instanceof AppError) {
        statusCode = err.status;
        data = {
            error: err.message,
        };
    }
    return res.status(statusCode).json(data);
};
export default errorHandler;
