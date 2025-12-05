'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class m_service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.order, { foreignKey: 'service_id' });
    }
  }
  m_service.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price_per_unit: DataTypes.DECIMAL(10, 2),
    unit: DataTypes.ENUM('kg', 'pcs'),
    status: DataTypes.ENUM('active', 'inactive')
  }, {
    sequelize,
    modelName: 'm_service',
  });
  return m_service;
};