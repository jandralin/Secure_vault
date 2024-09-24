const User = require('./models/user')
const { StribogCtx, stribog } = require('./ctypto_algorithm/stribog/stribog')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const crypto = require('crypto'); // Импортируем библиотеку для генерации соли




const generateAccessToken = (id, role) => {
	const payload = {
		id,
		role
	}
	return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '24h' })
}


class authController {
	async registration(req, res) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: 'errors', errors })
			}
			const { userName, password } = req.body
			const candidate = await User.findOne({ where: { userName } })
			if (candidate) {
				return res.status(400).json({ message: 'user already exists' })
			}

			// Генерация случайной соли
			const salt = crypto.randomBytes(16).toString('hex'); // Генерация 16-байтной соли
			// стрибог пароль
			const ctx1 = new StribogCtx(512);
			stribog(ctx1, password + salt, password.length + salt.length);
			const hashPassword = Buffer.from(ctx1.h).toString('hex');
			// создаем юзера
			await User.create({
				userName: userName,
				password: hashPassword,
				salt: salt,
				// role: 'ADMIN'
			})
			return res.json({ message: 'user created' })
		} catch (e) {
			console.error('Registration error:', e); // Вывод ошибки для диагностики
			res.status(400).json({ message: 'registration error' }); // Возвращаем ошибку
		}
	}



	async login(req, res) {
		try {
			const { userName, password } = req.body
			console.log(req.body); 
			const user = await User.findOne({ where: { userName } })
			if (!user) {
				return res.status(400).json({ message: 'user not exists' })
			}
			// Хеширование введенного пароля
			const ctx = new StribogCtx(512);
			stribog(ctx, password + user.salt, password.length + user.salt.length);
			const hashPassword = Buffer.from(ctx.h).toString('hex'); // Получаем хеш как hex строку

			if (Buffer.compare(Buffer.from(hashPassword), Buffer.from(user.password)) !== 0) {
				return res.status(400).json({ message: 'Incorrect password' });
			}

			const token = generateAccessToken(user._id, user.role)

			return res.json({ token });
		} catch (e) {
			res.status(400).json({ message: 'login error' }); // Возвращаем ошибку
		}
	}

	async getUsers(req, res) {
		try {
			const users = await User.findAll()
			res.json(users)
		} catch (e) {
			console.error('getUsers error '); // Лог ошибок
			res.status(500).json({ error: e.message }); // Возвращаем ошибку
		}
	}
}


module.exports = new authController()