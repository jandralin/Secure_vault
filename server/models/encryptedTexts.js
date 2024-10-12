const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const EncryptionAlgorithm = require('./encryptionAlgorithm');
const EncryptionKeys = require('./encryptionKeys'); // Импортируйте модель EncryptionKey

const EncryptedTexts = sequelize.define('EncryptedTexts', {
  encryptedText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  encryptionKeyId: { // Новый внешний ключ
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EncryptionKeys,
      key: 'id',
    },
  },
}, {
  tableName: 'EncryptedTexts',
  timestamps: true,
});

// Связь с пользователем
EncryptedTexts.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// Связь с алгоритмом
EncryptedTexts.belongsTo(EncryptionAlgorithm, {
  foreignKey: 'algorithmId',
  as: 'algorithm',
});

// Связь с ключом шифрования
EncryptedTexts.belongsTo(EncryptionKeys, {
  foreignKey: 'encryptionKeyId',
  as: 'encryptionKey', // Имя ассоциации
});

module.exports = EncryptedTexts;
