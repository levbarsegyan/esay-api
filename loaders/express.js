import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import routes from '../api';
import cors from 'cors';
export default ({ app, }) => {
    const corsOption = {
        origin: [ ' http:
    };
    dotenv.config();
    app.use(express.urlencoded({ extended: true, }));
    app.use(express.json());
    app.use(cors(corsOption));
    app.use(express.urlencoded({ extended: true, }));
    app.use(express.json());
    app.use('/api', routes());
    app.use((err, req, res, next) => {        
        err.statusCode = err.statusCode || 500;
        err.status = err.status || 'error';
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            error: err,
        });
    });
};
