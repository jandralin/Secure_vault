const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text) {
    // Настройка транспортера
    const transporter = nodemailer.createTransport({
			host: 'smtp.yandex.ru',
			port: 25,
        secure: false, // true для 465, false для других портов
        auth: {
           
        }
    });

    // Опции письма
    const mailOptions = {
        from: '"Код подтверждения от crypto" <anastacia.vasyukowa@yandex.ru>', // От кого
        to, // Кому
        subject, // Тема
        text // Текст письма
    };

    // Отправка письма
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendEmail;



