'use strict';
module.exports = (sequelize, DataTypes) => {
  var Sentry = sequelize.define('Sentry', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    login: DataTypes.STRING,
    feature: DataTypes.STRING,
    access_mode: DataTypes.STRING,
    org_id: DataTypes.STRING
  }, {});
  Sentry.associate = function(models) {
    // associations can be defined here
  };
  return Sentry;
};