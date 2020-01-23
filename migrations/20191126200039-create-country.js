'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('countries', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt:{
        type:Sequelize.DATE      
      },
      updatedAt:{
        type:Sequelize.DATE      
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('countries');
  }
};