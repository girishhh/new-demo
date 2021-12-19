"use strict";
module.exports = (sequelize, DataTypes) => {
  const VersionHistory = sequelize.define(
    "VersionHistory",
    {
      versionableType: {
        type: DataTypes.STRING,
        require: true,
      },
      versionableId: {
        type: DataTypes.INTEGER,
        require: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        require: true,
      },
      diff: {
        type: DataTypes.JSONB,
      },
      event: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {}
  );
  VersionHistory.associate = function (models) {
    // associations can be defined here
  };
  return VersionHistory;
};
