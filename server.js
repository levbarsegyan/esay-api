import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
import swaggerUi from 'swagger-ui-express';
import yamljs from 'yamljs';
import resolve from 'json-refs';
import path from 'path';
import db from './database/connection.js';
import userRouter from './routes/userApi.js';
import cors from 'cors';
import { errors } from 'celebrate';
const corsOption = {
    origin: [ ' http:
};
dotenv.config();
app.use(express.urlencoded({ extended: true, }));
app.use(express.json());
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true, }));
app.use(express.json());
const multiFileSwagger = (root) => {
    const options = {
        filter: [ 'relative', 'remote' ],
        loaderOptions: {
            processContent: function (res, callback) {
                callback(null, yamljs.parse(res.text));
            },
        },
    };
    return resolve.resolveRefs(root, options).then(
        function (results) {
            return results.resolved;
        },
        function (err) {
            console.log(err.stack);
        }
    );
};
(async () => {
    const swaggerDocument = await multiFileSwagger(
        yamljs.load(path.resolve(process.cwd(), './api-docs/index.yaml'))
    );
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
})();
app.use('/api/user', userRouter);
app.use(errors());
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
(async () => {
    try { await db.authenticate();
        await db.sync();
        console.log('All models were synchronized successfully.');
        console.log(process.env.NODE_ENV);
    } catch (err) {
        console.log('Error: ' + err);
    }
})();
export default app;
