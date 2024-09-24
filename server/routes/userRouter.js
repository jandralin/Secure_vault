const Router = require('express')
const controller = require('../authController')


const router = new Router()

// запросы
router.post('/', controller.login)

module.exports = router
