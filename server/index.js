const express = require('express')
const authRouter = require('./authRouter')
const sequelize = require('./database')
require('dotenv').config();


const PORT = process.env.PORT

// приложение
const app = express()

app.use(express.json())
app.use('/auth', authRouter)

// запуск
const start = async () => {
	try {
		await sequelize.authenticate()
			.then(() => {
				console.log('Соединение с базой данных успешно установлено.');
			})
			.catch((err) => {
				console.error('Ошибка подключения к базе данных:', err);
			});
		await sequelize.sync()
			.then(() => {
				console.log('Таблицы есть');
			})
			.catch((err) => {
				console.error('Ошибка создания таблиц', err);
			});
		app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
	} catch (e) {
		console.log(e)
	}
}

start()