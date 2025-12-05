'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user, { foreignKey: 'user_id' });
      this.belongsTo(models.order, { foreignKey: 'order_id' });
      this.belongsTo(models.m_package, { foreignKey: 'package_id' });
    }
  }
  transaction.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: DataTypes.ENUM('order', 'package'),
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    package_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_price: DataTypes.DECIMAL(10, 2),
    snap_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: DataTypes.ENUM('pending', 'failed', 'success'),
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};