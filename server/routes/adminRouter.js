const Router = require('express');
const { check } = require('express-validator');
const roleMiddleware = require('../middleware/roleMiddleware');
const controller = require('../authController');
const router = new Router();

// Только админ может регистрировать пользователей
router.get('/', roleMiddleware('ADMIN'), (req, res) => {
	res.send('Welcome to the admin dashboard');
});


router.post('/registration',
    roleMiddleware('ADMIN'), // Проверяем, что пользователь — админ
    [
        check('userName', 'userName must not be empty')
            .trim()
            .notEmpty()
            .withMessage('userName must not be empty or consist of whitespace'),

        check('password', 'password must not be empty')
            .trim()
            .notEmpty()
            .withMessage('password must not be empty or consist of whitespace')
            .isLength({ min: 4 }).withMessage('password must be longer than 4 characters')
            .matches(/\S/).withMessage('password must not consist of whitespace'),
    ],
    controller.registration
);


router.get('/users', roleMiddleware('ADMIN'), controller.getUsers);

module.exports = router;
