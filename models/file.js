'use strict';
module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    title: {  type: DataTypes.STRING, allowNull: false  },
    password: DataTypes.STRING,
    hasPassword: DataTypes.BOOLEAN,
    urlPath: {  type: DataTypes.STRING, allowNull: false,  validate: {  notEmpty: true  }  },
    filePath: {  type: DataTypes.STRING, allowNull: false,  validate: {  notEmpty: true  } },
    downloadCount: {  type: DataTypes.INTEGER },
    recoveryEmail: { type: DataTypes.STRING },
    canDelete: DataTypes.BOOLEAN
  },
  {});
  File.associate = function(models) {
    // associations can be defined here
  };
  return File;
};