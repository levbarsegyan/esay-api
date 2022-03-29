import db from '../connection.js';
import sequelize from 'sequelize';
const User = db.define('users', {
    fullname: {
        type: sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize.STRING,
        allowNull: true,
    },
    userid: {
        type: sequelize.STRING,
        allowNull: true,
    },
    provider: {
        type: sequelize.STRING,
        defaultValue: 'easy collab',
    },
});
export default User;
