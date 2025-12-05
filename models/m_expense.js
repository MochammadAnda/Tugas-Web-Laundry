'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class m_expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  m_expense.init({
    name: DataTypes.STRING,
    category: DataTypes.ENUM('operational', 'salary', 'marketing','etc'),
    amount: DataTypes.DECIMAL(10, 2),
    due_date: DataTypes.DATEONLY,
    status: DataTypes.ENUM('pending', 'done')
  }, {
    sequelize,
    modelName: 'm_expense',
  });
  return m_expense;
};