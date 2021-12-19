'use strict';
module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define('Note', {
    title: DataTypes.STRING,
    urlPath: {
      type: DataTypes.STRING, allowNull: false,  validate: {  notEmpty: true  }
    },
    noteContent: {  type: DataTypes.TEXT, allowNull: false,  validate: {  notEmpty: true  }  },
    hasPassword: DataTypes.BOOLEAN,
    password: DataTypes.STRING,
    recoveryEmail: { type: DataTypes.STRING }
  }, {});
  Note.associate = function(models) {
    // associations can be defined here
  };
  return Note;
};