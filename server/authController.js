const User = require('./models/user')
const { StribogCtx, stribog } = require('./ctypto_algorithm/stribog/stribog')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const sendEmail = require('./sendEmail')
const crypto = require('crypto'); // Импортируем библиотеку для генерации соли


function getRedirectUrlByRole(role) {
	return role === 'ADMIN' ? '/admin' : '/crypto';
}

const generateAccessToken = (id, role) => {
	const payload = {
		userId: id, 
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
			const { email, password } = req.body
			const candidate = await User.findOne({ where: { email } })
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
				email: email,
				password: hashPassword,
				salt: salt,
				verificationCode: 0,
				verificationCodeExpiry: 0
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
			const { email, password } = req.body
			console.log(req.body); 
			const user = await User.findOne({ where: { email } })
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

			try {
				console.log('User found, proceeding to send verification code:', user.email);
				await sendVerificationCode(user);
				return res.json({ message: `Код отправлен на почту: ${user.email}` });
		} catch (error) {
				return res.status(500).json({ message: 'Error sending verification code' });
		}
		
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

	async verifyCode(req, res) {
    const { email, code } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    if (user.verificationCode !== code || Date.now() > user.verificationCodeExpiry) {
        return res.status(400).json({ message: 'Invalid or expired code' });
    }

    // Код верен, создаем токен
   		const token = generateAccessToken(user.id, user.role)
			const redirectUrl = getRedirectUrlByRole(user.role);
      return res.json({ token, redirectUrl });
}

}

const sendVerificationCode = async (user) => {
	console.log('Inside sendVerificationCode for user:', user.email);
	try {
			const code = Math.floor(100000 + Math.random() * 900000).toString();
			user.verificationCode = code;
			user.verificationCodeExpiry = Date.now() + 10 * 60 * 1000;

			await user.save(); // Сохраняем обновленного пользователя

			await sendEmail(user.email, 'Ваш код подтверждения', `Ваш код: ${code}`);
			console.log('Verification code sent:', code);
	} catch (error) {
			console.error('Error in sendVerificationCode:', error);
			throw new Error('Ошибка при отправке кода подтверждения');
	}
};

module.exports = new authController()