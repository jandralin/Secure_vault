const jwt = require('jsonwebtoken')
require('dotenv').config();

module.exports = function (req, res, next) {
	if(req.method === 'OPTIONS') {
		next()
	}

	try {
		const token = req.headers.authorization?.split(' ')[1]
		if(!token) {
			return res.status(403).json({message: 'user is not authorized'})
		}
		const decodedData = jwt.verify(token, process.env.SECRET_KEY)
		req.user = decodedData
		next()
	} catch (e) {
		console.log(e)
		return res.status(403).json({message: 'user is not authorized'})
	}
}