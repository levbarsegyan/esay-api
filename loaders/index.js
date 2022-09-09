import expressLoader from './express';
import sequelizeLoader from './sequelize';
import swaggerLoader from './swagger';
export default async ({ expressApp, }) => {
    expressLoader({ app: expressApp, });
    console.log('[MODULE] Express Initialized.');
    try {
        await sequelizeLoader();
    } catch (error) {
        console.log('[MODULE] Sequelize Initialization Failed!');
        throw error;
    }
    console.log('[MODULE] Sequelize Initialized.');
    await swaggerLoader({ app: expressApp, });
    console.log('[MODULE] Swagger Initialized.');
};
