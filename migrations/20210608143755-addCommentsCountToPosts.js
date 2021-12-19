'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Posts","commentsCount",{type: Sequelize.INTEGER});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Posts","commentsCount");
  }
};
