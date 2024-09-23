const forge = require('node-forge');
const BigInteger = forge.jsbn.BigInteger;

// Генерация случайного простого числа
function generatePrime(bits) {
    return new Promise((resolve, reject) => {
        forge.prime.generateProbablePrime(bits, (err, num) => {
            if (err) return reject(err);
            resolve(num);
        });
    });
}

// Генерация RSA ключей
async function generateRSAKeypair(bits) {
    const p = await generatePrime(bits / 2);
    const q = await generatePrime(bits / 2);

    const n = p.multiply(q); // n = p * q
    const phi = p.subtract(BigInteger.ONE).multiply(q.subtract(BigInteger.ONE)); // φ(n)

    const e = new BigInteger('65537'); // Часто используемое значение для e
    const d = e.modInverse(phi); // d = e^(-1) mod φ(n)

    return {
        publicKey: { e: e.toString(), n: n.toString() },
        privateKey: { d: d.toString(), n: n.toString() }
    };
}

// Шифрование
function encrypt(publicKey, message) {
    const e = new BigInteger(publicKey.e);
    const n = new BigInteger(publicKey.n);
    const m = new BigInteger(forge.util.createBuffer(message).toHex(), 16); // Преобразуем сообщение в число

    const c = m.modPow(e, n); // c = m^e mod n
    return c.toString(16); // Возвращаем зашифрованное сообщение в шестнадцатичном формате
}

// Расшифрование
function decrypt(privateKey, ciphertext) {
    const d = new BigInteger(privateKey.d);
    const n = new BigInteger(privateKey.n);
    const c = new BigInteger(ciphertext, 16); // Преобразуем шифротекст из шестнадцатичного формата в число

    const m = c.modPow(d, n); // m = c^d mod n
    return forge.util.hexToBytes(m.toString(16)); // Преобразуем обратно в строку
}

// Пример использования
(async () => {
    const bits = 16384;
    const keypair = await generateRSAKeypair(bits);

    const message = 'Hello, RSA!';
    console.log('Исходное сообщение:', message);

    const encryptedMessage = encrypt(keypair.publicKey, message);
    console.log('Зашифрованное сообщение:', encryptedMessage);

    const decryptedMessage = decrypt(keypair.privateKey, encryptedMessage);
    console.log('Расшифрованное сообщение:', decryptedMessage);
})();
