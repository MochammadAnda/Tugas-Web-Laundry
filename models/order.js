'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: 'user_id' });
      this.belongsTo(models.service, { foreignKey: 'service_id' });
      this.belongsTo(models.user_package, { foreignKey: 'user_package_id' });
      this.hasMany(models.user_package_log, { foreignKey: 'order_id' });
      this.hasMany(models.order_log, { foreignKey: 'order_id' });
      this.hasMany(models.transaction, { foreignKey: 'order_id' });
    }
  }
  order.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity_kg: DataTypes.INTEGER,
    delivery_method: DataTypes.ENUM('pickup_drop', 'self_pickup'),
    address: DataTypes.STRING,
    user_package_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: DataTypes.ENUM('pending', 'failed', 'success', 'done')
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};