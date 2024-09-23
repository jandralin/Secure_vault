const Router = require('express')
const { check } = require('express-validator')

const router = new Router()
const controller = require('./authController')

// запросы
router.post('/registration', [
	check('userName', 'userName must not be empty')
		.trim()  // Удаляет пробелы в начале и в конце
		.notEmpty()
		.withMessage('userName must not be empty or consist of whitespace'),  // Сообщение об ошибке

	check('password', 'password must not be empty')
		.trim()  // Удаляет пробелы в начале и в конце
		.notEmpty()
		.withMessage('password must not be empty or consist of whitespace') // Сообщение об ошибке
		.isLength({ min: 4 }).withMessage('password must be longer than 4 characters')
		.matches(/\S/).withMessage('password must not consist of whitespace'), // Проверка, что пароль не состоит из пробелов
], controller.registration)


router.post('/login', controller.login)
router.get('/users', controller.getUsers)

module.exports = router
