'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Appointments', {
      id: Sequelize.INTEGER,
      place: Sequelize.STRING,
      doctorId: { type: Sequelize.INTEGER, foreignKey: true },
      patientId: { type: Sequelize.INTEGER, foreignKey: true },      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Appointments');
  }
};