'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_package_log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.user_package, { foreignKey: 'user_package_id' });
      this.belongsTo(models.order, { foreignKey: 'order_id' });
    }
  }
  user_package_log.init({
    user_package_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('initial', 'transaction')
    },
    quota: {
      type: DataTypes.INTEGER
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'user_package_log',
  });
  return user_package_log;
};