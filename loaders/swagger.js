import swaggerUi from 'swagger-ui-express';
import yamljs from 'yamljs';
import resolve from 'json-refs';
import path from 'path';
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
export default async ({ app, }) => {
    const swaggerDocument = await multiFileSwagger(
        yamljs.load(path.resolve(process.cwd(), './api-docs/index.yaml'))
    );
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
