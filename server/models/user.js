const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  userName: {
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
		defaultValue: "USER"
	}
}, {
	tableName: 'User',
  timestamps: false
});

module.exports = User;