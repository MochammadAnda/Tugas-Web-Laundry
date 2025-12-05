'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order_log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.orders, { foreignKey: 'order_id' });
    }
  }
  order_log.init({
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    log: DataTypes.STRING,
    img_url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'order_log',
  });
  return order_log;
};