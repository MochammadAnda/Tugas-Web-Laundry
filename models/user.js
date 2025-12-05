'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Package, {
        through: models.user_package,
        foreignKey: 'user_id',
        otherKey: 'package_id'
      });
      this.hasMany(models.user_package, { foreignKey: 'user_id' });
      this.hasMany(models.order, { foreignKey: 'user_id' });
      this.hasMany(models.transaction, { foreignKey: 'user_id' });
    }
  }
  user.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'user')
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};