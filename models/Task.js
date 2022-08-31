import db from '../database/connection';
import sequelize from 'sequelize';
const task = db.define('tasks', {
    id: {
        type: sequelize.DataTypes.UUID,
        primaryKey: true,
    },
    task_id: {
        type: sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: sequelize.DataTypes.STRING(50),
        allowNull: true,
    },
    title: {
        type: sequelize.DataTypes.STRING(255),
        allowNull: false,
    },
    assignee: {
        type: sequelize.DataTypes.STRING(128),
        allowNull: true,
    },
    created_by: {
        type: sequelize.DataTypes.STRING(128),
        allowNull: false,
    },
    priority: {
        type: sequelize.DataTypes.STRING(20),
        allowNull: false,
    },
    status: {
        type: sequelize.DataTypes.STRING(20),
        allowNull: false,
    },
    in_project: {
        type: sequelize.DataTypes.INTEGER,
        references: {
            model: 'projects',
            key: 'id',
        },
    },
});
export default task;
