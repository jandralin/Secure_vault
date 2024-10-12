import React, { useState, useEffect } from 'react';
import { createRoundKey, createRSAKey, decryptMessage, encryptMessage, fetchKeys, fetchMessages, signText, verify } from '../api/cryptoAPI';
import '../styles/CryptoForm.css'

const CryptoForm = ({ algorithmId }) => {
	const arrBits = [1024, 2048, 4096, 8192, 16834]
	const [bits, setBits] = useState('');
	const [text, setText] = useState('');
	const [messages, setMessages] = useState([]);
	const [keys, setKeys] = useState([]);
	const [errorMessage, setErrorMessage] = useState('');
	const [selectedKeyId, setSelectedKeyId] = useState('');
	const [keyInput, setKeyInput] = useState('');
	const [isSelectDisabled, setIsSelectDisabled] = useState(true); // New state for disabling select
	const getKeys = async () => {
		try {
			const token = localStorage.getItem('authToken');
			const userId = localStorage.getItem('userId');
			const keyData = await fetchKeys(userId, algorithmId, token);
			setKeys(keyData);
		} catch (error) {
			setErrorMessage(error.message || 'Ошибка при получении ключей');
			setTimeout(() => setErrorMessage(''), 3000);
		}
	};

	const getMessages = async () => {
		try {
			const token = localStorage.getItem('authToken');
			const userId = localStorage.getItem('userId');
			const mesData = await fetchMessages(userId, algorithmId, token);
			setMessages(mesData);
		} catch (error) {
			setErrorMessage(error.message || 'Ошибка при получении сообщений');
			setTimeout(() => setErrorMessage(''), 3000);
		}
	};

	const encryptData = async (message, algorithmId) => {
		try {
			const token = localStorage.getItem('authToken');
			const userId = localStorage.getItem('userId');
			const encryptedKeyId = localStorage.getItem('encryptedKeyId');
			const response = await encryptMessage(userId, encryptedKeyId, message, algorithmId, token);
			getKeys();
			getMessages();
			// Возвращаем зашифрованный текст
			return response.encryptedText;
		} catch (error) {
			setErrorMessage(error.message || 'Ошибка при шифровании');
			setTimeout(() => setErrorMessage(''), 3000);
			return null; // Возвращаем null в случае ошибки
		}
	};

	const decryptData = async (message, algorithmId) => {
		try {
			const token = localStorage.getItem('authToken');
			const userId = localStorage.getItem('userId');
			const encryptedKeyId = localStorage.getItem('encryptedKeyId');
			const response = await decryptMessage(userId, encryptedKeyId, message, algorithmId, token);

			// Возвращаем зашифрованный текст
			return response.decryptedMessage;
		} catch (error) {
			setErrorMessage(error.message || 'Ошибка при шифровании');
			setTimeout(() => setErrorMessage(''), 3000);
			return null; // Возвращаем null в случае ошибки
		}
	};



	const handleMessageEncrypt = async (message, algorithmId) => {
		const encryptedData = await encryptData(message, algorithmId);
		if (encryptedData) {
			setText(encryptedData); // Обновляем текст с зашифрованным сообщением
		}
	};

	const handleMessageDecrypt = async (message, algorithmId) => {
		const decryptedData = await decryptData(message, algorithmId);
		if (decryptedData) {
			setText(decryptedData); // Обновляем текст с зашифрованным сообщением
		}
	};

	const handleCreateRSA = async () => {

		try {
			setIsSelectDisabled(false)
			const token = localStorage.getItem('authToken');
			const userId = localStorage.getItem('userId');
			const newKeyId = await createRSAKey(userId, bits, token)
			localStorage.setItem('encryptedKeyId', newKeyId.id);
			getKeys();
			setKeyInput(newKeyId.publicKey)
		} catch (error) {
			setErrorMessage(error.message || 'Ошибка при создании ключа');
			setTimeout(() => setErrorMessage(''), 3000);
		}
	};

	const handleCreateRoundKey = async () => {

		try {
			setIsSelectDisabled(false)
			const token = localStorage.getItem('authToken');
			const userId = localStorage.getItem('userId');
			const newKeyId = await createRoundKey(userId, keyInput, token)
			localStorage.setItem('encryptedKeyId', newKeyId.id);
			getKeys();
			setKeyInput(newKeyId.roundKeys)
		} catch (error) {
			setErrorMessage(error.message || 'Ошибка при создании ключа');
			setTimeout(() => setErrorMessage(''), 3000);
		}
	};

const handleSelectBits = (event) => {
	const selectedBits = event.target.value;
	setBits(Number(selectedBits));
}


	useEffect(() => {
		if (algorithmId) {
			getKeys();
			getMessages();
			setIsSelectDisabled(true)
		}
	}, [algorithmId]);


	const handleKeyChange = (event) => {
		setIsSelectDisabled(true)
		const selectedId = event.target.value;
		setSelectedKeyId(selectedId);
		localStorage.setItem('encryptedKeyId', selectedId);
		console.log('ключ установлен')
	};



	const handleMessageChange = (event) => {
		const selectedMessageId = event.target.value; // Получаем выбранный ID
		const selectedMessage = messages[selectedMessageId]; // Ищем по id
		console.log(selectedMessage); // Проверяем, что получаем правильное сообщение
		if (selectedMessage) {
			setText(selectedMessage.encryptedText); // Устанавливаем текст в textarea
			setSelectedKeyId(selectedMessage.encryptionKeyId); // Автоматически устанавливаем ключ
			localStorage.setItem('encryptedKeyId', selectedMessage.encryptionKeyId);
			console.log('ключ установлен')
		} else {
			setText(''); // Очищаем текст, если сообщение не найдено
		}
	};

	const handleSignText = async () => {
		try {
			const token = localStorage.getItem('authToken');
			const file = await signText(text, token); // Изменено на SignText

			// Создание URL для скачивания файла
			const url = window.URL.createObjectURL(new Blob([file]));
			const a = document.createElement('a');
			a.href = url;
			a.download = 'signedFile.txt'; // Имя файла для скачивания
			document.body.appendChild(a);
			a.click(); // Симулируем клик для скачивания
			document.body.removeChild(a); // Удаляем ссылку после скачивания
			window.URL.revokeObjectURL(url); // Освобождаем память
		} catch (error) {
			console.error(error); // Выводим ошибку в консоль
		}
	};


	return (
		<div className='crypto-container'>

			<div className="text-container">
				<textarea className='text'
					placeholder='Введите новое сообщение'
					value={text}
					onChange={(e) => setText(e.target.value)}>
				</textarea>
				<button className='sign-button'
					onClick={handleSignText}>ПОДПИСАТЬ</button>
			</div>

			<div className='settings-container'>
				<select className='message-select'
					onChange={handleMessageChange} >
					<option className='def-item'
						value="">Выберите зашифрованное сообщение</option>
					{messages.map((elem, index) => (
						<option key={index} value={index}>
							{elem.encryptedText}
						</option>
					))}
				</select>

				<select className='key-select'
					onChange={handleKeyChange}
				>
					<option className='def-item'
						value="">Выберите ключ</option>
					{keys.map(elem => (
						<option key={elem.id} value={elem.id}>
							{algorithmId == 1 ? elem.roundKeys : elem.publicKey}
						</option>
					))}
				</select>
				<div>


					{algorithmId == 1 ? (
						<div className='key-container'>
							<textarea className="key-textarea"
								placeholder='Введите новый ключ'
								onChange={(e) => {
									setIsSelectDisabled(false)
									setKeyInput(e.target.value)
								}}
								value={isSelectDisabled ? '' : keyInput}
							></textarea>

							<button className='sign-button'
								onClick={handleCreateRoundKey}>Создать ключ</button> 

						</div>
					) : (
						<div className='key-container'>
							<select className='input-bits' onChange={handleSelectBits}>
								<option className="def-item">Битность ключа</option>
							{arrBits.map((elem, index) => {
								return <option key={index} 
									value={elem}>{elem}</option>}
							)}	
							</select>
							<button className='sign-button'
								onClick={handleCreateRSA}>Создать ключ</button> 
							<textarea
								className="key-textarea"
								value={keyInput}
								onChange={(e) => setKeyInput(e.target.value)}
								style={{ display: isSelectDisabled ? 'none' : 'block' }}
							></textarea>
						</div>
					)}
				</div>




				<div className='container-func'>
				<button className='sign-button'
						onClick={() => handleMessageEncrypt(text, algorithmId)}>Зашифровать</button>
					<button className='sign-button'
						onClick={() => handleMessageDecrypt(text, algorithmId)}
					>Расшифровать</button>
					
					{errorMessage && <div className="error-message">{errorMessage}</div>}
				</div>
				</div>
		</div>
	);
}

export default CryptoForm;
