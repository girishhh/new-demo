'use strict';
module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define('Patient', {
    name: DataTypes.STRING
  }, {});
  Patient.associate = function(models) {
    Patient.hasMany(models.Profile, { constraints: false, foreignKey: "profilableId", scope: { profilableType: 'patient'} });
    Patient.belongsToMany(models.Doctor, { through: models.Appointment, foreignKey: "patientId", otherKey: "doctorId" });
  };
  return Patient;
};