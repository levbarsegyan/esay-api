import express from 'express';
import dotenv from 'dotenv';
import initRoutes from './routes/api';
import swaggerUi from 'swagger-ui-express';
import yamljs from 'yamljs';
import resolve from 'json-refs';
import path from 'path';
import db from './app/database/connection';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
const corsOption = {
    origin: [ 'http:
};
const app = express();
dotenv.config();
app.use(express.urlencoded({ extended: true, }));
app.use(express.json());
app.use(cors(corsOption));
(async () => {
    try {
        await db.authenticate();
        await db.sync({ alter: true, });
        console.log('All models were synchronized successfully.');
        console.log(process.env.NODE_ENV);
    } catch (err) {
        console.log('Error: ' + err);
    }
})();
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
initRoutes(app);
app.use(errorHandler);
export default app;
