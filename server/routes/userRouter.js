const Router = require('express')
const authController = require('../authController')


const router = new Router()

// запросы
router.post('/', authController.login)
router.post('/verify', authController.verifyCode)

module.exports = router
