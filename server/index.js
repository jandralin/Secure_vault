const express = require('express')
const userRouter = require('./routes/userRouter')
const adminRouter = require('./routes/adminRouter')
const sequelize = require('./database')
require('dotenv').config();
const authMiddleware = require('./middleware/authMiddleware')

const PORT = process.env.PORT


function getRedirectUrlByRole(role) {
	return role === 'ADMIN' ? '/admin' : '/crypto';
}




// приложение
const app = express()

app.use(express.json())

// Маршруты для авторизации
app.use('/login', userRouter);

// Используем middleware для проверки авторизации
app.use(authMiddleware);

// Перенаправление на соответствующие маршруты
app.get('/', (req, res) => {
    if (req.user) {
        // Если пользователь авторизован, перенаправляем на соответствующий путь
				const redirectUrl = getRedirectUrlByRole(req.user.role);
        return res.redirect(redirectUrl);
    } else {
        // Если пользователь не авторизован, перенаправляем на страницу логина
        return res.redirect('/login');
    }
});


// Маршруты для администратора
app.use('/admin', adminRouter);

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