'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Files',
      'downloadCount',
      {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Files','downloadCount')
  }
};
