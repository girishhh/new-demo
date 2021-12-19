'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Posts", "accountId", { type: Sequelize.INTEGER });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Posts", "accountId");
  }
};
