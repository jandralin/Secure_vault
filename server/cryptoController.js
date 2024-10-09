const EncryptedTexts = require('./models/encryptedTexts')
const EncryptionKey = require('./models/encryptionKeys')
const EncryptionAlgorithm = require('./models//encryptionAlgorithm')

const { encryptKuzn, decryptKuzn } = require('./ctypto_algorithm/kuznechik/functionKuzn')
const { generateRSAKeypair, encryptRSA, decryptRSA } = require('./ctypto_algorithm/rsa/RSA')


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
		const { algorithmId } = req.query; // Получаем algorithmId из запроса

		if (!algorithmId) {
			return res.status(400).json({ message: 'Algorithm ID is required' });
		}

		try {
			const keys = await EncryptionKey.findAll({
				where: { algorithmId },
			});

			if (keys.length === 0) {
				return res.status(404).json({ message: 'No keys found for this algorithm' });
			}

			return res.status(200).json(keys);
		} catch (error) {
			console.error('Error fetching keys:', error.message);
			return res.status(500).json({ message: 'Failed to retrieve keys', error: error.message });
		}
	}


	async createKey(req, res) {
		const { algorithmId, publicKey, privateKey, roundKeys, userId } = req.body;

		// Проверка входящих данных
		if (!algorithmId) {
			return res.status(400).json({ message: 'Algorithm ID is required' });
		}

		try {
			// Проверка на наличие userId
			if (!userId) {
				return res.status(400).json({ message: 'User ID is required' });
			}

			if (algorithmId === 1) { // Алгоритм Кузнечик
				if (!roundKeys) {
					return res.status(400).json({ message: 'Round keys are required for Кузнечик' });
				}

				await EncryptionKey.create({
					algorithmId,
					roundKeys,
					userId // Добавляем userId
				});
				return res.status(201).json({ message: 'Round keys created successfully' });

			} else if (algorithmId === 2) { // Алгоритм RSA
				if (!publicKey || !privateKey) {
					return res.status(400).json({ message: 'Public and private keys are required for RSA' });
				}

				await EncryptionKey.create({
					algorithmId,
					publicKey,
					privateKey,
					userId // Добавляем userId
				});
				return res.status(201).json({ message: 'Keys created successfully' });

			} else {
				return res.status(400).json({ message: 'Invalid algorithm ID' });
			}
		} catch (error) {
			console.error('Error creating key:', error);
			return res.status(500).json({ message: 'Failed to create key' });
		}
	}


	async getEncryptedTexts(req, res) {
    const { userId } = req.query; // Получаем userId из параметров запроса

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const encryptedTexts = await EncryptedTexts.findAll({
            where: { userId }, // Фильтруем по userId
            include: [
                {
                    model: EncryptionAlgorithm,
                    as: 'algorithm',
                    attributes: ['id', 'name'] // Укажите, какие поля алгоритма нужно вернуть
                }
            ]
        });

        return res.status(200).json(encryptedTexts); // Отправляем зашифрованные тексты
    } catch (error) {
        console.error('Error fetching encrypted texts:', error);
        return res.status(500).json({ message: 'Failed to retrieve encrypted texts' });
    }
};

async createEncrypt(req, res) {
	const { encryptedText, algorithmId, userId } = req.body;

	// Проверка входящих данных
	if (!encryptedText || !algorithmId || !userId) {
			return res.status(400).json({ message: 'Encrypted text, algorithm ID, and user ID are required' });
	}

	try {
			// Получаем алгоритм по ID
			const algorithm = await EncryptionAlgorithm.findByPk(algorithmId);
			if (!algorithm) {
					return res.status(404).json({ message: 'Algorithm not found' });
			}

			// Сохранение зашифрованного текста в базу данных
			await EncryptedTexts.create({
					encryptedText,
					algorithmId,
					userId, // Сохраняем ID пользователя
			});

			return res.status(201).json({ message: 'Encrypted text saved successfully' });
	} catch (error) {
			console.error('Error saving encrypted text:', error);
			return res.status(500).json({ message: 'Failed to save encrypted text' });
	}
}




	async encrypt(req, res) {
		const { message, key, algorithmId } = req.body;

		// Проверка входящих данных
		if (!message || !key || !algorithmId) {
			return res.status(400).json({ message: 'Message, key, and algorithm ID are required' });
		}

		try {
			// Получаем алгоритм по ID
			const algorithm = await EncryptionAlgorithm.findByPk(algorithmId);
			if (!algorithm) {
				return res.status(404).json({ message: 'Algorithm not found' });
			}

			if (algorithmId === "1") {
				const encryptedMessage = encryptKuzn(key, message);
				return res.status(200).json({ encryptedMessage });
			}
			if (algorithmId === "2") {
				const encryptedMessage = encryptRSA(key.publicKey, message);
				return res.status(200).json({ encryptedMessage });
			}
		} catch (error) {
			console.error('Error during encryption:', error);
			return res.status(500).json({ message: 'Failed to encrypt the message' });
		}
	}

	async decrypt(req, res) {
		const { message, key, algorithmId } = req.body;

		// Проверка входящих данных
		if (!message || !key || !algorithmId) {
			return res.status(400).json({ message: 'Message, key, and algorithm ID are required' });
		}

		try {
			// Получаем алгоритм по ID
			const algorithm = await EncryptionAlgorithm.findByPk(algorithmId);
			if (!algorithm) {
				return res.status(404).json({ message: 'Algorithm not found' });
			}

			if (algorithmId === 1) {
				const decryptedMessage = decryptKuzn(key, message);
				return res.status(200).json({ decryptedMessage });
			}
			if (algorithmId === 2) {
				const decryptedMessage = decryptRSA(key.privateKey, message);
				return res.status(200).json({ decryptedMessage });
			}
	} catch(error) {
		console.error('Error during encryption:', error);
		return res.status(500).json({ message: 'Failed to encrypt the message' });
	}
};

	async createRSAKey(req, res) {
	const { bits } = req.body;

	// Проверка входящих данных
	if (!bits || isNaN(bits) || bits <= 0) {
		return res.status(400).json({ message: 'Valid key size in bits is required' });
	}

	try {
		// Генерация пары ключей RSA
		const keypair = await generateRSAKeypair(bits);

		// Возвращаем сгенерированные ключи в ответе
		return res.status(201).json({
			keypair
		});
	} catch (error) {
		console.error('Error generating RSA key pair:', error);
		return res.status(500).json({ message: 'Failed to generate RSA key pair', error: error.message });
	}
};
}

module.exports = new cryptoController()