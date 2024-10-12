const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const EncryptionAlgorithm = sequelize.define('EncryptionAlgorithm', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Уникальность имени алгоритма
  },
}, 
{
  tableName: 'EncryptionAlgorithm',
  timestamps: false,
});

module.exports = EncryptionAlgorithm;
