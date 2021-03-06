'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Sentries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      login: {
        type: Sequelize.STRING
      },
      feature: {
        type: Sequelize.STRING
      },
      access_mode: {
        type: Sequelize.STRING
      },
      org_id: {
        type: Sequelize.STRING
      },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: new Date()
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: new Date()
        }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Sentries');
  }
};