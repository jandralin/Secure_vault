const Router = require('express')
const cryptoController = require('../cryptoController')
const authMiddleware = require('../middleware/authMiddleware')


const router = new Router()


router.get('/algorithms', authMiddleware, cryptoController.getAlgorithms)
router.post('algorithms',authMiddleware, cryptoController.createAlgorithm)


router.get('/keys',authMiddleware, cryptoController.getKeys)
router.post('/keys',authMiddleware, cryptoController.createKey)
router.post('/keys/create',authMiddleware, cryptoController.createRSAKey)

router.get('/encrypt',authMiddleware, cryptoController.encrypt)
router.post('/encrypt',authMiddleware, cryptoController.createEncrypt)

router.get('/encrypted',authMiddleware, cryptoController.getEncryptedTexts)

router.post('/decrypt',authMiddleware, cryptoController.decrypt)

module.exports = router
