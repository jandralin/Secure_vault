const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const EncryptionAlgorithm = require('./encryptionAlgorithm');

const EncryptionKey = sequelize.define('EncryptionKey', {
  algorithmId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EncryptionAlgorithm,
      key: 'id',
    },
  },
  publicKey: {
    type: DataTypes.TEXT,
    allowNull: true, // У RSA
  },
  privateKey: {
    type: DataTypes.TEXT,
    allowNull: true, // У RSA
  },
  roundKeys: {
    type: DataTypes.TEXT,
    allowNull: true, // У Кузнечика
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'EncryptionKeys',
  timestamps: false, // Если временные метки не нужны
});

// Связь с пользователем
EncryptionKey.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Связь с алгоритмом
EncryptionKey.belongsTo(EncryptionAlgorithm, {
  foreignKey: 'algorithmId',
  as: 'algorithm',
});

module.exports = EncryptionKey;
