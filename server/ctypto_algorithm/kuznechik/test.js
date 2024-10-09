const Gost12_15 = require('./kuzn.js')


const g = Gost12_15.get_instance();

// Гостовский ключ
const generalKey = [
    0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff,
    0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77,
    0xfe, 0xdc, 0xba, 0x98, 0x76, 0x54, 0x32, 0x10,
    0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef
];

g.init_round_consts();
const roundKeys = g.generating_round_keys(generalKey);

function encryptDecryptExample(roundKeys) {
    console.log("Testing encryption/decryption");
    console.log("-----------------------------");

    const g = Gost12_15.get_instance();

    const data = [
        0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x00,
        0xff, 0xee, 0xdd, 0xcc, 0xbb, 0xaa, 0x99, 0x88
    ];

    console.log("Data: ");
    console.log(data.map(byte => `0x${byte.toString(16).padStart(2, '0')}`).join(' '));
    console.log();

    const encData = g.l_s_x_encrypt_data(data, roundKeys);

    console.log("Enc data: ");
    console.log(encData.map(byte => `0x${byte.toString(16).padStart(2, '0')}`).join(' '));
    console.log();

    const decData = g.l_s_x_decrypt_data(encData, roundKeys);

    console.log("Dec data: ");
    console.log(decData.map(byte => `0x${byte.toString(16).padStart(2, '0')}`).join(' '));
    console.log();
    console.log("----------------------");
}

encryptDecryptExample(roundKeys);


