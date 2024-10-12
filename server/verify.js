const fs = require('fs');
const forge = require('node-forge');

function verifySignature(filePath, publicKeyPath) {
    if (!fs.existsSync(filePath)) {
        console.error(`Файл ${filePath} не найден.`);
        return;
    }

    if (!fs.existsSync(publicKeyPath)) {
        console.error(`Файл ${publicKeyPath} не найден.`);
        return;
    }

    const data = fs.readFileSync(filePath, 'utf8');
    const parts = data.split('---\nSignature: ');

    const text = parts[0].trim();
    const signatureB64 = parts[1].trim();
    const signature = Buffer.from(signatureB64, 'base64');

    // Чтение открытого ключа из файла
    const publicKeyPem = fs.readFileSync(publicKeyPath, 'utf8');
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

    // Проверка подписи
    const md = forge.md.sha256.create();
    md.update(text, 'utf8');
    const isValid = publicKey.verify(md.digest().bytes(), signature);

    console.log(`Результат проверки: ${isValid ? 'Подпись верна' : 'Подпись недействительна'}`);
}

// Вызов функции с указанием путей
verifySignature('C:/Users/User/Documents/Программы/SecureAuth/server/signedFile.txt', 'C:/Users/User/Documents/Программы/SecureAuth/server/public_key.pem');
