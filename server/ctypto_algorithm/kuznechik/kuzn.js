class Gost12_15 {
	constructor() {
		// Полином x ^ 8 + x ^ 7 + x ^ 6 + x + 1
		this.generating_polynom = 0xc3;

		this.block_size = 16;
		this.imito_len = 8;

		this.round_consts = [];

		// Коэффициенты в функции l из линейного перемешивания
		this.l_coefficients = [
			1, 148, 32, 133, 16, 194, 192, 1,
			251, 1, 192, 194, 16, 133, 32, 148
		];

		// Значения B128
		this.b128 = [
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
			0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x87
		];

		// Таблица замен (s_table) - заглушка
		this.s_table = [
			0xfc, 0xee, 0xdd, 0x11, 0xcf, 0x6e, 0x31, 0x16,
			0xfb, 0xc4, 0xfa, 0xda, 0x23, 0xc5, 0x4, 0x4d,
			0xe9, 0x77, 0xf0, 0xdb, 0x93, 0x2e, 0x99, 0xba,
			0x17, 0x36, 0xf1, 0xbb, 0x14, 0xcd, 0x5f, 0xc1,
			0xf9, 0x18, 0x65, 0x5a, 0xe2, 0x5c, 0xef, 0x21,
			0x81, 0x1c, 0x3c, 0x42, 0x8b, 0x01, 0x8e, 0x4f,
			0x05, 0x84, 0x02, 0xae, 0xe3, 0x6a, 0x8f, 0xa0,
			0x06, 0x0b, 0xed, 0x98, 0x7f, 0xd4, 0xd3, 0x1f,
			0xeb, 0x34, 0x2c, 0x51, 0xea, 0xc8, 0x48, 0xab,
			0xf2, 0x2a, 0x68, 0xa2, 0xfd, 0x3a, 0xce, 0xcc,
			0xb5, 0x70, 0x0e, 0x56, 0x08, 0x0c, 0x76, 0x12,
			0xbf, 0x72, 0x13, 0x47, 0x9c, 0xb7, 0x5d, 0x87,
			0x15, 0xa1, 0x96, 0x29, 0x10, 0x7b, 0x9a, 0xc7,
			0xf3, 0x91, 0x78, 0x6f, 0x9d, 0x9e, 0xb2, 0xb1,
			0x32, 0x75, 0x19, 0x3d, 0xff, 0x35, 0x8a, 0x7e,
			0x6d, 0x54, 0xc6, 0x80, 0xc3, 0xbd, 0x0d, 0x57,
			0xdf, 0xf5, 0x24, 0xa9, 0x3e, 0xa8, 0x43, 0xc9,
			0xd7, 0x79, 0xd6, 0xf6, 0x7c, 0x22, 0xb9, 0x03,
			0xe0, 0x0f, 0xec, 0xde, 0x7a, 0x94, 0xb0, 0xbc,
			0xdc, 0xe8, 0x28, 0x50, 0x4e, 0x33, 0x0a, 0x4a,
			0xa7, 0x97, 0x60, 0x73, 0x1e, 0x00, 0x62, 0x44,
			0x1a, 0xb8, 0x38, 0x82, 0x64, 0x9f, 0x26, 0x41,
			0xad, 0x45, 0x46, 0x92, 0x27, 0x5e, 0x55, 0x2f,
			0x8c, 0xa3, 0xa5, 0x7d, 0x69, 0xd5, 0x95, 0x3b,
			0x07, 0x58, 0xb3, 0x40, 0x86, 0xac, 0x1d, 0xf7,
			0x30, 0x37, 0x6b, 0xe4, 0x88, 0xd9, 0xe7, 0x89,
			0xe1, 0x1b, 0x83, 0x49, 0x4c, 0x3f, 0xf8, 0xfe,
			0x8d, 0x53, 0xaa, 0x90, 0xca, 0xd8, 0x85, 0x61,
			0x20, 0x71, 0x67, 0xa4, 0x2d, 0x2b, 0x09, 0x5b,
			0xcb, 0x9b, 0x25, 0xd0, 0xbe, 0xe5, 0x6c, 0x52,
			0x59, 0xa6, 0x74, 0xd2, 0xe6, 0xf4, 0xb4, 0xc0,
			0xd1, 0x66, 0xaf, 0xc2, 0x39, 0x4b, 0x63, 0xb6
		]

		// Обратная таблица замен - заглушка
		this.inverse_s_table = [
			0xa5, 0x2d, 0x32, 0x8f, 0x0e, 0x30, 0x38, 0xc0,
			0x54, 0xe6, 0x9e, 0x39, 0x55, 0x7e, 0x52, 0x91,
			0x64, 0x03, 0x57, 0x5a, 0x1c, 0x60, 0x07, 0x18,
			0x21, 0x72, 0xa8, 0xd1, 0x29, 0xc6, 0xa4, 0x3f,
			0xe0, 0x27, 0x8d, 0x0c, 0x82, 0xea, 0xae, 0xb4,
			0x9a, 0x63, 0x49, 0xe5, 0x42, 0xe4, 0x15, 0xb7,
			0xc8, 0x06, 0x70, 0x9d, 0x41, 0x75, 0x19, 0xc9,
			0xaa, 0xfc, 0x4d, 0xbf, 0x2a, 0x73, 0x84, 0xd5,
			0xc3, 0xaf, 0x2b, 0x86, 0xa7, 0xb1, 0xb2, 0x5b,
			0x46, 0xd3, 0x9f, 0xfd, 0xd4, 0x0f, 0x9c, 0x2f,
			0x9b, 0x43, 0xef, 0xd9, 0x79, 0xb6, 0x53, 0x7f,
			0xc1, 0xf0, 0x23, 0xe7, 0x25, 0x5e, 0xb5, 0x1e,
			0xa2, 0xdf, 0xa6, 0xfe, 0xac, 0x22, 0xf9, 0xe2,
			0x4a, 0xbc, 0x35, 0xca, 0xee, 0x78, 0x05, 0x6b,
			0x51, 0xe1, 0x59, 0xa3, 0xf2, 0x71, 0x56, 0x11,
			0x6a, 0x89, 0x94, 0x65, 0x8c, 0xbb, 0x77, 0x3c,
			0x7b, 0x28, 0xab, 0xd2, 0x31, 0xde, 0xc4, 0x5f,
			0xcc, 0xcf, 0x76, 0x2c, 0xb8, 0xd8, 0x2e, 0x36,
			0xdb, 0x69, 0xb3, 0x14, 0x95, 0xbe, 0x62, 0xa1,
			0x3b, 0x16, 0x66, 0xe9, 0x5c, 0x6c, 0x6d, 0xad,
			0x37, 0x61, 0x4b, 0xb9, 0xe3, 0xba, 0xf1, 0xa0,
			0x85, 0x83, 0xda, 0x47, 0xc5, 0xb0, 0x33, 0xfa,
			0x96, 0x6f, 0x6e, 0xc2, 0xf6, 0x50, 0xff, 0x5d,
			0xa9, 0x8e, 0x17, 0x1b, 0x97, 0x7d, 0xec, 0x58,
			0xf7, 0x1f, 0xfb, 0x7c, 0x09, 0x0d, 0x7a, 0x67,
			0x45, 0x87, 0xdc, 0xe8, 0x4f, 0x1d, 0x4e, 0x04,
			0xeb, 0xf8, 0xf3, 0x3e, 0x3d, 0xbd, 0x8a, 0x88,
			0xdd, 0xcd, 0x0b, 0x13, 0x98, 0x02, 0x93, 0x80,
			0x90, 0xd0, 0x24, 0x34, 0xcb, 0xed, 0xf4, 0xce,
			0x99, 0x10, 0x44, 0x40, 0x92, 0x3a, 0x01, 0x26,
			0x12, 0x1a, 0x48, 0x68, 0xf5, 0x81, 0x8b, 0xc7,
			0xd6, 0x20, 0x0a, 0x08, 0x00, 0x4c, 0xd7, 0x74
		]

		// Инициализация раундовых констант
		this.round_consts = this.init_round_consts();
	}

	// Статический метод для получения единственного экземпляра класса (Singleton)
	static get_instance() {
		if (!Gost12_15._instance) {
			Gost12_15._instance = new Gost12_15();
		}
		return Gost12_15._instance;
	}

	// TEST
	galois_mult(polynom1, polynom2) {
		// Начальное значение для результата умножения
		let mult_res = 0;

		// Цикл выполняется 8 раз, т.к. операция проводится побитно для 8-битных чисел
		for (let i = 0; i < 8; i++) {
				// Если младший бит polynom2 равен 1, выполняем сложение по модулю 2 с polynom1
				if (polynom2 & 1) {
						mult_res ^= polynom1;
				}

				// Определяем старший бит polynom1
				let high_bit = polynom1 & 0x80;

				// Сдвиг polynom1 влево на один бит, обрезая до 8 бит
				polynom1 = (polynom1 << 1) & 0xFF;

				// Если старший бит был равен 1, применяем порождающий полином
				if (high_bit) {
						polynom1 ^= this.generating_polynom;
				}

				// Сдвигаем polynom2 вправо на один бит
				polynom2 >>= 1;
		}

		// console.log("mult_res", mult_res);

		// Возвращаем результат умножения в поле Галуа
		return mult_res;
}

	l_func(data) {
		// Инициализируем переменную для результата линейного преобразования
		let la = 0;

		// Выполняем цикл по всем элементам блока (размер блока определяется this.block_size)
		for (let i = 0; i < this.block_size; i++) {
			// Для каждого элемента выполняется умножение в поле Галуа между элементом данных и коэффициентом
			// Сложение с предыдущими результатами выполняется по модулю 2 (операция XOR)
			la ^= this.galois_mult(data[i], this.l_coefficients[i]);
		}

		// console.log("l_func", la)

		// Возвращаем результат линейного преобразования
		return la;
	}

	inverse_l_func(data) {
		// Инициализируем переменную для результата обратного линейного преобразования
		let la = 0;

		// Проходим по элементам блока с конца к началу (с предпоследнего до первого)
		for (let i = this.block_size - 2; i >= 0; i--) {
			// Для каждого элемента выполняется умножение в поле Галуа с коэффициентом, 
			// сдвинутым на одну позицию вправо (i+1), затем результат складывается по модулю 2 (XOR)
			la ^= this.galois_mult(data[i], this.l_coefficients[i + 1]);
		}

		// Обрабатываем последний элемент блока отдельно, умножая его на первый коэффициент
		la ^= this.galois_mult(data[this.block_size - 1], this.l_coefficients[0]);

		// Возвращаем результат обратного линейного преобразования
		return la;
	}

	l_transformation(data) {
    // Создаем копию данных, чтобы избежать изменения исходного массива
    let r_data = [...data];
    
    // Инициализируем переменную для результата линейного преобразования
    let la = 0;
    
    // Цикл выполняется по количеству элементов блока (this.block_size)
    for (let i = 0; i < this.block_size; i++) {
        // Вызываем функцию линейного преобразования для текущего состояния данных
        la = this.l_func(r_data);
        
        // Обновляем данные: убираем первый элемент и добавляем результат линейного преобразования (la) в конец
        r_data = r_data.slice(1).concat(la);
    }
    
    // Возвращаем итоговое преобразованное состояние данных
    return r_data;
}

inverse_l_transformation(data) {
	// Создаем копию данных, чтобы не изменять исходный массив
	let rData = [...data];
	
	// Инициализируем переменную для результата обратного линейного преобразования
	let la = 0;
	
	// Цикл выполняется по количеству элементов блока (this.block_size)
	for (let i = 0; i < this.block_size; i++) {
			// Вызываем функцию обратного линейного преобразования для текущего состояния данных
			la = this.inverse_l_func(rData);
			
			// Обновляем данные: добавляем результат преобразования (la) в начало массива
			// и убираем последний элемент
			rData = [la].concat(rData.slice(0, -1));
	}
	
	// Возвращаем итоговое преобразованное состояние данных
	return rData;
}

s_transformation(data) {
	// Инициализируем массив для результата преобразования, заполненный нулями, размером блока
	let s_data = new Array(this.block_size).fill(0);
	
	// Проходим по каждому элементу данных
	for (let i = 0; i < this.block_size; i++) {
			// Для каждого элемента берем значение из таблицы замен (s_table) по индексу, соответствующему значению элемента
			s_data[i] = this.s_table[data[i]];
	}
	
	// Возвращаем преобразованные данные
	return s_data;
}

inverse_s_transformation(data) {
	// Инициализируем массив для результата обратного преобразования, заполненный нулями, размером блока
	let s_data = new Array(this.block_size).fill(0);
	
	// Проходим по каждому элементу данных
	for (let i = 0; i < this.block_size; i++) {
			// Для каждого элемента берем значение из обратной таблицы замен (inverse_s_table) по индексу,
			// соответствующему значению элемента данных
			s_data[i] = this.inverse_s_table[data[i]];
	}
	
	// Возвращаем обратное преобразование данных
	return s_data;
}

x_transformation(data, key) {
	// Инициализируем массив для результата операции XOR, заполненный нулями, размером блока
	let data_x = new Array(this.block_size).fill(0);
	
	// Проходим по каждому элементу данных
	for (let i = 0; i < this.block_size; i++) {
			// Выполняем операцию XOR между соответствующими элементами данных и ключа
			data_x[i] = data[i] ^ key[i];
	}
	
	// Возвращаем результат операции XOR
	return data_x;
}

init_round_consts() {
	// Инициализируем массив для констант раундов, состоящий из 32 массивов длиной block_size, заполненных нулями
	this.round_consts = Array.from({ length: 32 }, () => new Array(this.block_size).fill(0));
	
	// Проходим по каждому индексу (всего 32 итерации для 32 констант)
	for (let i = 0; i < this.round_consts.length; i++) {
			// Устанавливаем последнее значение в массиве константы как i + 1
			this.round_consts[i][this.block_size - 1] = i + 1;
			
			// Применяем обратное преобразование данных к константе
			this.round_consts[i] = this.inverse_data(this.round_consts[i]);
			
			// Применяем линейное преобразование (L-преобразование) к константе
			this.round_consts[i] = this.l_transformation(this.round_consts[i]);
			
			// Еще раз применяем обратное преобразование данных к результату
			this.round_consts[i] = this.inverse_data(this.round_consts[i]);
	}
	
	// Возвращаем сгенерированные константы раундов
	return this.round_consts;
}

generating_round_keys(key) {
	// Инициализируем массив для ключей раундов, состоящий из 10 массивов длиной block_size, заполненных нулями
	let round_keys = Array.from({ length: 10 }, () => new Array(this.block_size).fill(0));
	
	// Устанавливаем первые два ключа раундов из начального ключа
	for (let i = 0; i < this.block_size; i++) {
			round_keys[0][i] = key[i];
	}
	for (let i = 0; i < this.block_size; i++) {
			round_keys[1][i] = key[i + this.block_size];
	}

	// Присваиваем первые два ключа переменным k1 и k2 для дальнейшей обработки
	let k1 = round_keys[0];
	let k2 = round_keys[1];
	
	// Инициализируем временный массив для промежуточных результатов
	let lsx = new Array(this.block_size).fill(0);

	// Проходим по 4 итерациям для генерации ключей
	for (let i = 0; i < 4; i++) {
			// Внутренний цикл для обработки 8 операций
			for (let j = 0; j < 8; j++) {
					if (j % 2 === 0) {
							// Выполняем операцию XOR с константой и применяем цепочку преобразований к k1
							lsx = this.x_transformation(k1, this.round_consts[8 * i + j]);
							lsx = this.inverse_data(lsx);
							lsx = this.s_transformation(lsx);
							lsx = this.l_transformation(lsx);
							lsx = this.inverse_data(lsx);
							// Обновляем k2 после обработки
							k2 = this.data_xor(lsx, k2);
					} else {
							// Выполняем ту же операцию XOR с константой и преобразования к k2
							lsx = this.x_transformation(k2, this.round_consts[8 * i + j]);
							lsx = this.inverse_data(lsx);
							lsx = this.s_transformation(lsx);
							lsx = this.l_transformation(lsx);
							lsx = this.inverse_data(lsx);
							// Обновляем k1 после обработки
							k1 = this.data_xor(lsx, k1);
					}
			}

			// Сохраняем обновленные ключи раундов
			round_keys[i * 2 + 2] = k1;
			round_keys[i * 2 + 3] = k2;
	}

	// Возвращаем список ключей раундов
	return round_keys;
}

l_s_x_encrypt_data(data, round_keys) {
	// Создаем копию данных для шифрования, чтобы не изменять исходный массив
	let enc_data = [...data];
	
	// Выполняем 9 раундов линейного, S-преобразования и XOR с ключами раундов
	for (let i = 0; i < 9; i++) {
			// Применяем L-S-X преобразование и XOR с ключом текущего раунда
			enc_data = this.l_s_x_transformation(enc_data, round_keys[i]);
	}

	// Последний раунд применяет только XOR с последним ключом раунда
	enc_data = this.x_transformation(enc_data, round_keys[9]);
	
	// Возвращаем зашифрованные данные
	return enc_data;
}

l_s_x_decrypt_data(data, round_keys) {
	// Создаем копию данных для расшифрования, чтобы не изменять исходный массив
	let dec_data = [...data];
	
	// Выполняем 9 раундов обратного L-S-X преобразования и XOR с ключами раундов в обратном порядке
	for (let i = 9; i > 0; i--) {
			// Применяем обратное L-S-X преобразование и XOR с ключом текущего раунда
			dec_data = this.inverse_l_s_x_transformation(dec_data, round_keys[i]);
	}
	
	// Последний раунд применяет только XOR с первым ключом раунда
	dec_data = this.x_transformation(dec_data, round_keys[0]);
	
	// Возвращаем расшифрованные данные
	return dec_data;
}

l_s_x_transformation(data, round_key) {
	// Создаем копию данных для применения L-S-X преобразования
	let lsx_data = [...data];
	
	// Применяем операцию XOR с ключом раунда
	lsx_data = this.x_transformation(lsx_data, round_key);

	// console.log("x_transformation lsx_data", lsx_data)
	
	// Применяем обратное преобразование данных
	lsx_data = this.inverse_data(lsx_data);
	
	// console.log("inverse_data lsx_data", lsx_data)
	// Применяем S-преобразование
	lsx_data = this.s_transformation(lsx_data);

	// console.log("s_transformation lsx_data", lsx_data)
	
	// Применяем линейное преобразование (L-преобразование)
	lsx_data = this.l_transformation(lsx_data);

	// console.log("l_transformation lsx_data", lsx_data)
	
	// Применяем обратное преобразование данных
	lsx_data = this.inverse_data(lsx_data);

	// console.log("inverse_data lsx_data", lsx_data)
	
	// Возвращаем результат L-S-X преобразования
	return lsx_data;
}


inverse_l_s_x_transformation(data, round_key) {
	// Создаем копию данных для применения обратного L-S-X преобразования
	let lsx_data_inv = [...data];
	
	// Применяем операцию XOR с ключом раунда
	lsx_data_inv = this.x_transformation(lsx_data_inv, round_key);
	
	// Применяем обратное преобразование данных
	lsx_data_inv = this.inverse_data(lsx_data_inv);
	
	// Применяем обратное линейное преобразование (обратное L-преобразование)
	lsx_data_inv = this.inverse_l_transformation(lsx_data_inv);
	
	// Применяем обратное S-преобразование
	lsx_data_inv = this.inverse_s_transformation(lsx_data_inv);
	
	// Применяем обратное преобразование данных
	lsx_data_inv = this.inverse_data(lsx_data_inv);
	
	// Возвращаем результат обратного L-S-X преобразования
	return lsx_data_inv;
}

data_xor(data1, data2) {
	// Побитовый XOR
	return data1.map((d1, index) => d1 ^ data2[index]);
}

polynom_mult(binPolynom1, binPolynom2) {
	// Инициализируем массив для результата умножения многочленов
	// Размер результата равен сумме длин двух многочленов минус 1
	const bin_mult_res = new Array(binPolynom1.length + binPolynom2.length).fill(0);
	
	// Проходим по каждому элементу первого многочлена
	for (let i = 0; i < binPolynom1.length; i++) {
			// Проходим по каждому элементу второго многочлена
			for (let j = 0; j < binPolynom2.length; j++) {
					// Выполняем побитовое И между соответствующими элементами многочленов
					// и складываем результат по модулю 2 (операция XOR)
					bin_mult_res[i + j] ^= (binPolynom1[i] & binPolynom2[j]);
			}
	}
	
	// Возвращаем результат умножения многочленов
	return bin_mult_res;
}

get_binary_vector(number) {
	// Преобразуем число в бинарную строку длиной 8 бит (с ведущими нулями)
	const binStr = number.toString(2).padStart(8, '0');
	
	// Преобразуем бинарную строку в массив целых чисел, где каждый элемент представляет бит
	return Array.from(binStr).map(bit => parseInt(bit, 10));
}

inverse_data(data) {
	// Инвертируем массив
	return data.slice().reverse();
}

gamma_cryption(data, sync, round_keys) {
	// Инициализируем gammaSync с начальными значениями синхронизации
	const gammaSync = Array(this.block_size).fill(0);
	for (let i = 0; i < this.block_size / 2; i++) {
			gammaSync[i] = sync[i];
	}

	// Определяем количество блоков данных, которые нужно зашифровать
	const blockCount = Math.floor(data.length / this.block_size);
	
	// Инициализируем список для зашифрованных данных
	const encData = new Array(blockCount * this.block_size).fill(0);

	// Проходим по каждому блоку данных
	for (let i = 0; i < blockCount; i++) {
			// Устанавливаем последний элемент gammaSync как номер текущего блока + 1
			gammaSync[this.block_size - 1] = i + 1;
			const encSync = [...gammaSync];

			// Применяем L-S-X шифрование к gammaSync для генерации гаммы
			const generatedGamma = this.l_s_x_encrypt_data(encSync, round_keys);

			// Выполняем операцию XOR между данными и сгенерированной гаммой
			for (let j = 0; j < this.block_size; j++) {
					encData[this.block_size * i + j] = data[this.block_size * i + j] ^ generatedGamma[j];
			}
	}

	// Возвращаем зашифрованные данные
	return encData;
}



}

module.exports = Gost12_15