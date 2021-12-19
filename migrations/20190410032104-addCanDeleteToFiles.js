'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Files',
      'canDelete',
      {
        type: Sequelize.STRING,
        defaultValue: false
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Files','canDelete')
  }
};
