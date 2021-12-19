"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("VersionHistories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      versionableType: {
        type: Sequelize.STRING,
        require: true,
      },
      versionableId: {
        type: Sequelize.INTEGER,
        require: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        require: true,
      },
      diff: {
        type: Sequelize.JSONB,
      },
      event: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("VersionHistories");
  },
};
