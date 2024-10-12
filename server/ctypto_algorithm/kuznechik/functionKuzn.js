const Gost12_15 = require('./kuzn.js');

// function encryptKuzn(generalKeyHex, messageHex) {
//     const g = Gost12_15.get_instance();

//     // Преобразуем ключ в массив байтов
//     const generalKey = [];
//     for (let i = 0; i < generalKeyHex.length; i += 2) {
//         generalKey.push(parseInt(generalKeyHex.substr(i, 2), 16));
//     }

//     // Преобразуем сообщение в массив байтов
//     const message = [];
//     for (let i = 0; i < messageHex.length; i += 2) {
//         message.push(parseInt(messageHex.substr(i, 2), 16));
//     }

//     g.init_round_consts();
//     const roundKeys = g.generating_round_keys(generalKey);

//     // Шифрование
//     const encData = g.l_s_x_encrypt_data(message, roundKeys);
//     const encDataHex = encData.map(byte => byte.toString(16).padStart(2, '0')).join('');

//     return encDataHex; // Возвращаем зашифрованные данные
// }

// function decryptKuzn(generalKeyHex, encDataHex) {
//     const g = Gost12_15.get_instance();

//     // Преобразуем ключ в массив байтов
//     const generalKey = [];
//     for (let i = 0; i < generalKeyHex.length; i += 2) {
//         generalKey.push(parseInt(generalKeyHex.substr(i, 2), 16));
//     }

//     // Преобразуем зашифрованные данные в массив байтов
//     const encData = [];
//     for (let i = 0; i < encDataHex.length; i += 2) {
//         encData.push(parseInt(encDataHex.substr(i, 2), 16));
//     }

//     g.init_round_consts();
//     const roundKeys = g.generating_round_keys(generalKey);

//     // Дешифрование
//     const decData = g.l_s_x_decrypt_data(encData, roundKeys);
//     const decDataHex = decData.map(byte => byte.toString(16).padStart(2, '0')).join('');

//     return decDataHex; // Возвращаем расшифрованные данные
// }

// module.exports = {encryptKuzn, decryptKuzn}


// // // Пример использования функций
// // const generalKeyHex = "8899aabbccddeeff0011223344556677fedcba98765432100123456789abcdef";
// // const messageHex = "1122334455667700ffeeddccbbaa9988";

// // // Шифрование
// // const encryptedMessage = encrypt(generalKeyHex, messageHex);
// // console.log("Encrypted Data: ", encryptedMessage);

// // // Дешифрование
// // const decryptedMessage = decrypt(generalKeyHex, encryptedMessage);
// // console.log("Decrypted Data: ", decryptedMessage);
function padMessage(messageHex, blockSize) {
	const paddingSize = blockSize - (messageHex.length / 2) % blockSize;
	const paddingHex = paddingSize.toString(16).padStart(2, '0').repeat(paddingSize);
	return messageHex + paddingHex; // Возвращаем сообщение с паддингом
}

function unpadMessage(decryptedHex) {
	const paddingSize = parseInt(decryptedHex.slice(-2), 16);
	return decryptedHex.slice(0, -paddingSize * 2); // Убираем паддинг
}

function encryptKuzn(generalKeyHex, messageHex) {
	const g = Gost12_15.get_instance();
	
	const blockSize = 16; // Пример размера блока (в байтах)
	const paddedMessageHex = padMessage(messageHex, blockSize);
	
	// Шифрование в блоках
	const encryptedBlocks = [];
	for (let i = 0; i < paddedMessageHex.length; i += blockSize * 2) {
			const block = paddedMessageHex.substr(i, blockSize * 2);
			const encData = g.l_s_x_encrypt_data(
					Array.from({ length: block.length / 2 }, (_, j) => parseInt(block.substr(j * 2, 2), 16)),
					g.generating_round_keys(Array.from({ length: generalKeyHex.length / 2 }, (_, j) => parseInt(generalKeyHex.substr(j * 2, 2), 16)))
			);
			encryptedBlocks.push(encData.map(byte => byte.toString(16).padStart(2, '0')).join(''));
	}
	
	return encryptedBlocks.join(''); // Возвращаем зашифрованные данные
}

function decryptKuzn(generalKeyHex, encDataHex) {
	const g = Gost12_15.get_instance();
	
	const blockSize = 16; // Пример размера блока
	const decryptedBlocks = [];
	
	// Дешифрование в блоках
	for (let i = 0; i < encDataHex.length; i += blockSize * 2) {
			const block = encDataHex.substr(i, blockSize * 2);
			const decData = g.l_s_x_decrypt_data(
					Array.from({ length: block.length / 2 }, (_, j) => parseInt(block.substr(j * 2, 2), 16)),
					g.generating_round_keys(Array.from({ length: generalKeyHex.length / 2 }, (_, j) => parseInt(generalKeyHex.substr(j * 2, 2), 16)))
			);
			decryptedBlocks.push(decData.map(byte => byte.toString(16).padStart(2, '0')).join(''));
	}

	const decryptedHex = decryptedBlocks.join('');
	return unpadMessage(decryptedHex); // Убираем паддинг
}

module.exports = {encryptKuzn, decryptKuzn}