const Gost12_15 = require('./kuzn.js');

function encryptKuzn(generalKeyHex, messageHex) {
    const g = Gost12_15.get_instance();

    // Преобразуем ключ в массив байтов
    const generalKey = [];
    for (let i = 0; i < generalKeyHex.length; i += 2) {
        generalKey.push(parseInt(generalKeyHex.substr(i, 2), 16));
    }

    // Преобразуем сообщение в массив байтов
    const message = [];
    for (let i = 0; i < messageHex.length; i += 2) {
        message.push(parseInt(messageHex.substr(i, 2), 16));
    }

    g.init_round_consts();
    const roundKeys = g.generating_round_keys(generalKey);

    // Шифрование
    const encData = g.l_s_x_encrypt_data(message, roundKeys);
    const encDataHex = encData.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return encDataHex; // Возвращаем зашифрованные данные
}

function decryptKuzn(generalKeyHex, encDataHex) {
    const g = Gost12_15.get_instance();

    // Преобразуем ключ в массив байтов
    const generalKey = [];
    for (let i = 0; i < generalKeyHex.length; i += 2) {
        generalKey.push(parseInt(generalKeyHex.substr(i, 2), 16));
    }

    // Преобразуем зашифрованные данные в массив байтов
    const encData = [];
    for (let i = 0; i < encDataHex.length; i += 2) {
        encData.push(parseInt(encDataHex.substr(i, 2), 16));
    }

    g.init_round_consts();
    const roundKeys = g.generating_round_keys(generalKey);

    // Дешифрование
    const decData = g.l_s_x_decrypt_data(encData, roundKeys);
    const decDataHex = decData.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return decDataHex; // Возвращаем расшифрованные данные
}

module.exports = {encryptKuzn, decryptKuzn}


// // Пример использования функций
// const generalKeyHex = "8899aabbccddeeff0011223344556677fedcba98765432100123456789abcdef";
// const messageHex = "1122334455667700ffeeddccbbaa9988";

// // Шифрование
// const encryptedMessage = encrypt(generalKeyHex, messageHex);
// console.log("Encrypted Data: ", encryptedMessage);

// // Дешифрование
// const decryptedMessage = decrypt(generalKeyHex, encryptedMessage);
// console.log("Decrypted Data: ", decryptedMessage);
