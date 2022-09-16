console.log('inside index');
import express from 'express';
import loaders from './loaders';
const PORT = process.env.PORT || 5000;
(async () => {
    console.log('inside async');
    const app = express();
    await loaders({ expressApp: app, });
    app.listen(PORT, () => {
        console.log('[APP]');
        console.log(`> Server listening on port: ${PORT} <`);
        console.log(`> API Docs: http:
    }).on('error', err => {
        throw new Error(err);
    });
})();
