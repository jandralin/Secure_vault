const Router = require('express')
const cryptoController = require('../cryptoController')
const authMiddleware = require('../middleware/authMiddleware')
const signController = require('../signController')


const router = new Router()


router.get('/algorithms', authMiddleware, cryptoController.getAlgorithms)
router.post('/algorithms',authMiddleware, cryptoController.createAlgorithm)
router.get('/keys',authMiddleware, cryptoController.getKeys)
router.post('/keys/create/rsa',authMiddleware, cryptoController.createRSAKey)
router.post('/keys/create/round',authMiddleware, cryptoController.createRoundKey)
router.post('/encrypt',authMiddleware, cryptoController.encrypt)
router.get('/encrypted',authMiddleware, cryptoController.getEncryptedTexts)
router.post('/decrypt',authMiddleware, cryptoController.decrypt)

router.post('/sign', signController.sign)

module.exports = router
