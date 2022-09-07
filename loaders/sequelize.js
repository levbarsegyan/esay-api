import Sequelize from 'sequelize';
import config from '../config/config.js';
const nodeEnv = process.env.NODE_ENV;
const connectJson = config[ nodeEnv ];
const db = new Sequelize(connectJson.database, connectJson.username, connectJson.password, {
    host: connectJson.host,
    dialect: 'postgres',
    operatorsAliases: false,
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
export default async () => {
    await db.authenticate();
    console.log(`Using ${process.env.NODE_ENV} Database`);
    await db.sync();    
    console.log('All models are synchronized successfully.');
};
