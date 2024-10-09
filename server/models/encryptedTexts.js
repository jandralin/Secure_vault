const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const EncryptionAlgorithm = require('./encryptionAlgorithm');

const EncryptedText = sequelize.define('EncryptedText', {
  encryptedText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, 
{
  tableName: 'EncryptedTexts',
  timestamps: true,
});

// Связь с пользователем
EncryptedText.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Связь с алгоритмом
EncryptedText.belongsTo(EncryptionAlgorithm, {
  foreignKey: 'algorithmId', // Идентификатор алгоритма
  as: 'algorithm',
});

module.exports = EncryptedText;
