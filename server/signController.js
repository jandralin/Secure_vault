const forge = require('node-forge');
const fs = require('fs');

function signText(text) {
	// Читаем приватный ключ из файла
	const privateKeyPem = fs.readFileSync('C:/Users/User/Documents/Программы/SecureAuth/server/private_key.pem', 'utf8');

	const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

	// Создаем хэш от текста
	const md = forge.md.sha256.create();
	md.update(text, 'utf8');

	// Подписываем хэш
	const signature = privateKey.sign(md);

	// Кодируем подпись в Base64 для удобства
	const signatureB64 = forge.util.encode64(signature);

	// Возвращаем текст и подпись в виде строки
	return `${text}\n\n---\nSignature: ${signatureB64}`;
}


class signController {

	sign(req, res) {
		try {
				const { text } = req.body;
				const signedData = signText(text);
				const filePath = 'signedFile.txt';

				fs.writeFileSync(filePath, signedData);

				if (fs.existsSync(filePath)) {
						res.setHeader('Content-Type', 'text/plain');
						res.setHeader('Content-Disposition', 'attachment; filename="signedFile.txt"');
						res.download(filePath, 'signedFile.txt', (err) => {
								if (err) {
										console.error(err);
										res.status(500).send('Ошибка при скачивании файла');
								}
						});
				} else {
						res.status(404).send('Файл не найден');
				}
		} catch (error) {
				console.error(error);
				res.status(500).send('Ошибка при подписи текста');
		}
}
	
}
module.exports = new signController()