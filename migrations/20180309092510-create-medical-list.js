'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('MedicalLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
        name: { type: Sequelize.STRING(100), allowNull: true },
        composition: { type: Sequelize.STRING(250), allowNull: true },
        reimbursible: { type: Sequelize.STRING(100), allowNull: true },
        usage: { type: Sequelize.STRING(250), allowNull: true },
        comments: { type: Sequelize.STRING(250), allowNull: true },
        link: { type: Sequelize.STRING(250), allowNull: true },
        app_date: { type: Sequelize.DATE, defaultValue: new Date() },
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
    return queryInterface.dropTable('MedicalLists');
  }
};