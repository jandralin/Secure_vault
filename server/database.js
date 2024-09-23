const { Sequelize } = require('sequelize');
require('dotenv').config();

// Настройки подключения к базе данных
const sequelize = new Sequelize(
	process.env.DB_NAME, // Название БД
  process.env.DB_USER, // Пользователь
  process.env.DB_PASSWORD, // ПАРОЛЬ 
	{
		dialect: 'postgres',
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
});


// Проверка подключения


module.exports = sequelize;