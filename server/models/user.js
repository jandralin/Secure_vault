const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salt: { 
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "USER",
  },
  verificationCode: {
    type: DataTypes.STRING,
  },
  verificationCodeExpiry: { // Исправлено
    type: DataTypes.DATE, // Указываем тип данных, например, DATE
  }
}, {
  tableName: 'User',
  timestamps: false,
});

module.exports = User;
