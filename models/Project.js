import db from '../database/connection';
import sequelize from 'sequelize';
const project = db.define('projects', {
    id: {
        type: sequelize.DataTypes.INTEGER,
        primaryKey: true,
    },
    project_name: {
        type: sequelize.DataTypes.STRING(128),
        allowNull: false,
    },
    planned_start_date: {
        type: sequelize.DataTypes.DATE,
        allowNull: false,
    },
    planned_end_date: {
        type: sequelize.DataTypes.DATE,
        allowNull: false,
    },
    actual_start_date: {
        type: sequelize.DataTypes.DATE,
        allowNull: true,
    },
    actual_end_date: {
        type: sequelize.DataTypes.DATE,
        allowNull: true,
    },
    project_description: {
        type: sequelize.DataTypes.TEXT,
        allowNull: true,
    },
});
export default project;
