'use strict';
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', 
    {
      accNo: DataTypes.INTEGER
    }, 
    {
      name: {
        singular: "account",
        plural: "accounts"
      },
      // underscored: true,
    }
  );
  Account.associate = function(models) {
    Account.belongsTo(models.Doctor, { foreignKey: "doctorId" });
    Account.hasMany(models.Post, { foreignKey: "accountId", as: "articles" });
  };
  return Account;
};