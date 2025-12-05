'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: 'user_id' });
      this.belongsTo(models.m_package, { foreignKey: 'package_id' });
      this.hasMany(models.user_package_log, { foreignKey: 'user_package_id' });
      this.hasMany(models.order, { foreignKey: 'user_package_id' });
    }
  }
  user_package.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    package_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quota: DataTypes.INTEGER,
    expired_at: DataTypes.DATEONLY,
  }, {
    sequelize,
    modelName: 'user_package',
  });
  return user_package;
};