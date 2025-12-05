'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class m_asset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  m_asset.init({
    name: DataTypes.STRING,
    buy_price: DataTypes.DECIMAL(10, 2),
    nilai_sisa: DataTypes.DECIMAL(10, 2),
    umur_ekonomis: DataTypes.INTEGER,
    buy_date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'm_asset',
  });
  return m_asset;
};