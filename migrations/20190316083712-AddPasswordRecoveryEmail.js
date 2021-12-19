'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Files',
      'recoveryEmail',
      {
        type: Sequelize.STRING
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Files','recoveryEmail')
  }
};
