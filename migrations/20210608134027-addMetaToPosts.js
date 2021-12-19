'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Posts","metaInfo", { type: Sequelize.JSONB });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Posts","metaInfo");
  }
};
