'use strict';
module.exports = (sequelize, DataTypes) => {
  var MedicalList = sequelize.define('MedicalList', {
      name:  DataTypes.STRING,
      composition:  DataTypes.STRING,
      reimbursible:  DataTypes.STRING,
      usage:  DataTypes.STRING,
      comments:  DataTypes.STRING,
      link:  DataTypes.STRING,
      app_date:  DataTypes.DATE,
      UserId: DataTypes.INTEGER
  }, {});
  MedicalList.associate = function(models) {
    // associations can be defined here
   };
  return MedicalList;
};