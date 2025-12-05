'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class m_package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.User, {
        through: models.user_package,
        foreignKey: 'package_id',
        otherKey: 'user_id'
      });
      this.hasMany(models.user_package, { foreignKey: 'package_id' });
      this.hasMany(models.transaction, { foreignKey: 'package_id' });
    }
  }
  m_package.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.DECIMAL(10, 2)
  }, {
    sequelize,
    modelName: 'm_package',
  });
  return m_package;
};