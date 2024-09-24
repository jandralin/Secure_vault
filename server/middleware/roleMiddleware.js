const jwt = require('jsonwebtoken')
require('dotenv').config();

module.exports = function (requiredRole) {

	return function (req, res, next) {
		if (req.method === 'OPTIONS') {
			next()
		}
		try {
			const token = req.headers.authorization.split(' ')[1]
			if (!token) {
				return res.status(403).json({ message: 'user is not authorized' })
			}

			const { role: userRole } = jwt.verify(token, process.env.SECRET_KEY);
			
			if (userRole !== requiredRole) {
				return res.status(403).json({ message: 'user does not have access rights' });
			}
			
			next()
		} catch (e) {
			console.log(e)
			return res.status(403).json({ message: 'user is not authorized' })
		}
	}


}