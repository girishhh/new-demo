'use strict';
module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {    
  }, {});
  Appointment.associate = function(models) {
    // Appointment.belongsToMany(models.Doctor);
  };
  return Appointment;
};