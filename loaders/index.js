import expressLoader from './express';
import sequelizeLoader from './sequelize';
import swaggerLoader from './swagger';
export default async ({ expressApp, }) => {
    expressLoader({ app: expressApp, });
    console.log('Express Loaded.');
    try {
        await sequelizeLoader();
    } catch (error) {
        console.log('Sequelize loading failed!');
        throw error;
    }
    console.log('Sequelize Loaded.');
    await swaggerLoader({ app: expressApp, });
    console.log('Swagger Loaded.');
    return expressApp;
};
