import expressLoader from './express';
import swaggerLoader from './swagger';
export default async ({ expressApp, }) => {
    expressLoader({ app: expressApp, });
    console.log('[MODULE] Express Initialized.');
    await swaggerLoader({ app: expressApp, });
    console.log('[MODULE] Swagger Initialized.');
};
