const Router = require('express')
const authController = require('../authController')
const cryptoController = require('../cryptoController')


const router = new Router()

// запросы
router.post('/', authController.login)

module.exports = router
