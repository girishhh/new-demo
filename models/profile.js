'use strict';
module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    name: DataTypes.STRING,
    profilableType: DataTypes.STRING
  }, {});
  Profile.associate = function(models) {
    Profile.belongsTo(models.Doctor,{ constraints: false, as: "doctor", foreignKey: "profilableId"});
    Profile.belongsTo(models.Patient,{ constraints: false, as: "patient", foreignKey: "profilableId"});
  };
  return Profile;
};