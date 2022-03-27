'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        queryInterface.createTable('user', {
            fullname: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
        })
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.dropTable('User')
    },
}
