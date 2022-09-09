import { db } from '../loaders/sequelize';
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
    reset_password_token: {
        type: sequelize.STRING,
        allowNull: true,
    },
    reset_password_expires: {
        type: sequelize.DATE,
        allowNull: true,
    },
});
export default User;
