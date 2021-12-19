'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Notes',
      'recoveryEmail',
      {
        type: Sequelize.STRING
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Notes','recoveryEmail')
  }
};
