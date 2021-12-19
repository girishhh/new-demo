'use strict';
module.exports = (sequelize, DataTypes) => {
  const Doctor = sequelize.define('Doctor', {
    name: {
      type: DataTypes.STRING
    },
    fullAddress: DataTypes.TEXT
  }, {
    // hooks: {
    //   beforeBulkUpdate: ({ attributes, where }) => {
    //     console.log("beforeBulkUpdate", attributes);
    //     console.log("beforeBulkUpdate", where);
    //   },
    //   beforeBulkDestroy: ({ where, individualHooks }) => {
    //     console.log("beforeBulkDestroy", where);
    //     console.log("beforeBulkDestroy", individualHooks);
    //   }
    // },
    // validate: {
    //   testName() {
    //     console.log("DDDDDDDDDDDDDDDDDDD", this.name);
    //   },
    //   testHasName() {
    //     console.log("AAAAAAAAAAAAAAAAAAA", this.name);
    //   }
    // },
    // underscored: true,
    // version: true
    // freezeTableName: true,
  });
  Doctor.associate = function(models) {
    Doctor.hasOne(models.Account, { foreignKey: "doctorId" });
    Doctor.hasMany(models.Profile, { constraints: false, foreignKey: "profilableId", scope: { profilableType: 'doctor'} });
    Doctor.belongsToMany(models.Patient, { through: models.Appointment, foreignKey: "doctorId", otherKey: "patientId" });
  };
  Doctor.audit=true;
  return Doctor;
};