const EncryptedTexts = require('./models/encryptedTexts')
const EncryptionKeys = require('./models/encryptionKeys')
const EncryptionAlgorithm = require('./models//encryptionAlgorithm')

const { encryptKuzn, decryptKuzn } = require('./ctypto_algorithm/kuznechik/functionKuzn')
const { generateRSAKeypair, encryptRSA, decryptRSA } = require('./ctypto_algorithm/rsa/RSA')

function stringToHex(str) {
	return Buffer.from(str, 'utf8').toString('hex');
}

// Функция для преобразования hex в строку
function hexToString(hex) {
	return Buffer.from(hex, 'hex').toString('utf8');
}


class cryptoController {

	async createAlgorithm(req, res) {
		const { name } = req.body;
		if (!name) {
			return res.status(400).json({ message: 'Algorithm name is required' });
		}
		try {
			await EncryptionAlgorithm.create({ name });
			return res.status(201).json({ message: 'Algorithm created successfully' });
		} catch (error) {
			console.error('Error creating algorithm:', error);
			return res.status(500).json({ message: 'Failed to create algorithm' });
		}
	};

	async getAlgorithms(req, res) {
		try {
			const algorithms = await EncryptionAlgorithm.findAll();
			return res.status(200).json(algorithms); // Отправляем список алгоритмов
		} catch (error) {
			console.error('Error fetching algorithms:', error);
			return res.status(500).json({ message: 'Failed to retrieve algorithms' });
		}
	}

	async getKeys(req, res) {
		const { userId, algorithmId } = req.query; // Получаем userId и algorithmId из запроса

		if (!userId || !algorithmId) {
			return res.status(400).json({ message: 'User ID and Algorithm ID are required' });
		}

		try {
			const keys = await EncryptionKeys.findAll({
				where: {
					userId,
					algorithmId,
				},
				attributes: algorithmId == 1
					? ['id', 'roundKeys']
					: algorithmId == 2
						? ['id', 'publicKey']
						: [], // Возвращаем пустой массив, если алгоритм не 1 или 2
			});

			if (keys.length === 0) {
				return res.status(404).json({ message: 'No keys found for this user and algorithm' });
			}

			return res.status(200).json(keys);
		} catch (error) {
			console.error('Error fetching keys:', error.message);
			return res.status(500).json({ message: 'Failed to retrieve keys', error: error.message });
		}
	}

	async createRSAKey(req, res) {
    const { userId, bits } = req.body;

    // Проверка входящих данных
    if (!userId || !bits || isNaN(bits) || bits <= 0) {
        return res.status(400).json({ message: 'Valid user ID and key size in bits are required' });
    }

    try {
        // Генерация пары ключей RSA
        const keypair = await generateRSAKeypair(bits);

        // Сохранение ключа в базу данных
        const encryptionKey = await EncryptionKeys.create({
            userId,
            algorithmId: 2, // Укажите ID алгоритма RSA, если необходимо
						publicKey: JSON.stringify(keypair.publicKey), 
						privateKey: JSON.stringify(keypair.privateKey)
            // Добавьте другие поля, если необходимо
        });

        // Возвращаем id ключа и публичную часть ключа в ответе
        return res.status(201).json({
            id: encryptionKey.id,
            publicKey: encryptionKey.publicKey,
        });
    } catch (error) {
        console.error('Error generating RSA key pair:', error);
        return res.status(500).json({ message: 'Failed to generate RSA key pair', error: error.message });
    }
}

async createRoundKey(req, res) {
	const { userId, roundKeys } = req.body;

	// Проверка входящих данных
	if (!roundKeys) {
			return res.status(400).json({ message: 'Round keys are required' });
	}

	// Проверка на наличие userId
	if (!userId) {
			return res.status(400).json({ message: 'User ID is required' });
	}

	try {
			// Сохранение roundKeys в базу данных
			const encryptionKey = await EncryptionKeys.create({
					algorithmId: 1, // Укажите ID алгоритма, если необходимо
					roundKeys,
					userId, // Добавляем userId
			});

			return res.status(201).json({
					id: encryptionKey.id, // Возвращаем id созданного ключа
					message: 'Round keys created successfully',
			});
	} catch (error) {
			console.error('Error creating key:', error);
			return res.status(500).json({ message: 'Failed to create key', error: error.message });
	}
}

async getEncryptedTexts(req, res) {
	const { userId, algorithmId } = req.query; // Получаем userId и algorithmId из параметров запроса

	if (!userId || !algorithmId) {
			return res.status(400).json({ message: 'User ID and Algorithm ID are required' });
	}

	try {
			const encryptedTexts = await EncryptedTexts.findAll({
					where: {
							userId,
							algorithmId, // Фильтруем по userId и algorithmId
					},
					attributes: ['encryptedText', 'encryptionKeyId'], // Указываем, какие поля нужно вернуть
					include: [
							{
									model: EncryptionAlgorithm,
									as: 'algorithm',
									attributes: ['id', 'name'], // Укажите, какие поля алгоритма нужно вернуть, если они необходимы
							},
					],
			});

			return res.status(200).json(encryptedTexts); // Отправляем зашифрованные тексты
	} catch (error) {
			console.error('Error fetching encrypted texts:', error);
			return res.status(500).json({ message: 'Failed to retrieve encrypted texts', error: error.message });
	}
}


async encrypt(req, res) {
	const { userId, encryptionKeyId, message, algorithmId } = req.body;

	// Проверка входящих данных
	if (!encryptionKeyId || !message || !algorithmId || !userId) {
			return res.status(400).json({ message: 'Encryption key ID, message, algorithm ID, and user ID are required' });
	}

	try {
			// Проверка, что userId соответствует ключу
			const encryptionKey = await EncryptionKeys.findByPk(encryptionKeyId);
			if (!encryptionKey) {
					return res.status(404).json({ message: 'Encryption key not found' });
			}

			// Получаем алгоритм по ID
			const algorithm = await EncryptionAlgorithm.findByPk(algorithmId);
			if (!algorithm) {
					return res.status(404).json({ message: 'Algorithm not found' });
			}

			let encryptedMessage;
			if (algorithmId == 1) { // Алгоритм Кузнечик
				const hexMessage = stringToHex(message); // Преобразуем сообщение в hex
				encryptedMessage = encryptKuzn(encryptionKey.roundKeys, hexMessage);
			} else if (algorithmId == 2) { // Алгоритм RSA
				const publicKey = JSON.parse(encryptionKey.publicKey);
				encryptedMessage = encryptRSA(publicKey, message);
			} else {
					return res.status(400).json({ message: 'Invalid algorithm ID' });
			}

			// Сохраняем зашифрованное сообщение в базе данных
			const encryptedText = await EncryptedTexts.create({
					encryptedText: encryptedMessage,
					userId, // Сохраняем userId для связи
					algorithmId, // Сохраняем ID алгоритма
					encryptionKeyId // Сохраняем ID ключа
			});

			return res.status(201).json({
					message: 'Message encrypted and saved successfully',
					id: encryptedText.id,
					encryptedText: encryptedText.encryptedText,
					encryptionKeyId: encryptedText.encryptionKeyId
			});
	} catch (error) {
			console.error('Error during encryption:', error);
			return res.status(500).json({ message: 'Failed to encrypt the message', error: error.message });
	}
}



async decrypt(req, res) {
	const { userId, encryptionKeyId, message, algorithmId } = req.body;

	// Проверка входящих данных
	if (!encryptionKeyId || !message || !algorithmId || !userId) {
			return res.status(400).json({ message: 'Encryption key ID, message, algorithm ID, and user ID are required' });
	}

	try {
			// Получаем ключ шифрования по ID
			const encryptionKey = await EncryptionKeys.findByPk(encryptionKeyId);
			if (!encryptionKey) {
					return res.status(404).json({ message: 'Encryption key not found' });
			}

			// Получаем алгоритм по ID
			const algorithm = await EncryptionAlgorithm.findByPk(algorithmId);
			if (!algorithm) {
					return res.status(404).json({ message: 'Algorithm not found' });
			}

			let decryptedMessage;
			if (algorithmId == 1) { // Алгоритм Кузнечик
			
				decryptedMessage = decryptKuzn(encryptionKey.roundKeys, message);
				// Если нужно вернуть сообщение в обычном формате, преобразуем из hex
				decryptedMessage = hexToString(decryptedMessage);
			} else if (algorithmId == 2) { // Алгоритм RSA
				console.log('message', message)
				const privateKey = JSON.parse(encryptionKey.privateKey);
				decryptedMessage = decryptRSA(privateKey, message);
				console.log('decryptedMessage', decryptedMessage)
			} else {
					return res.status(400).json({ message: 'Invalid algorithm ID' });
			}

			return res.status(200).json({ decryptedMessage });
	} catch (error) {
			console.error('Error during decryption:', error);
			return res.status(500).json({ message: 'Failed to decrypt the message', error: error.message });
	}
}
}

module.exports = new cryptoController()