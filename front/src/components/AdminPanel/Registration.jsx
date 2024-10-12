import React, { useState } from 'react';
import '../styles/Registration.css';
import { registerUser } from '../api/authAPI'; // Убедитесь, что путь правильный

const Registration = () => {
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');

	const validateEmail = (email) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(String(email).toLowerCase());
	};

	const registrationUser = async (e) => {
		e.preventDefault(); // Предотвращаем перезагрузку страницы

		if (!validateEmail(email)) {
			setErrorMessage('Неверный формат email');
			setTimeout(() => setErrorMessage(''), 3000);
			return; // Прерываем выполнение, если email неверный
		}

		const registrData = { email, password };
		const token = localStorage.getItem('authToken'); // Логика получения токена

		try {
			await registerUser(registrData, token); // Вызов функции регистрации
			setSuccessMessage('Пользователь успешно создан');
			setEmail(''); // Очистка поля email
			setPassword(''); // Очистка поля password
			setTimeout(() => setSuccessMessage(''), 3000);
		} catch (error) {
			console.error("Ошибка регистрации:", error);
			setErrorMessage(error.message || 'Ошибка регистрации');
			setTimeout(() => setErrorMessage(''), 3000);
		}
	};

	return (
		<div className="registr-container">
			<h2 className="header">РЕГИСТРАЦИЯ</h2>
			<div className='messages'>
				{errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
				{successMessage && <div className="alert alert-success">{successMessage}</div>}
			</div>
			<form className="form-container" onSubmit={registrationUser}>
				<div className="form">
					<input
						type="email"
						className="form-input"
						id="email"
						placeholder="Введите логин"
						required
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
				</div>
				<div className="form">
					<input
						type="password"
						className="form-input"
						id="password"
						placeholder="Введите пароль"
						required
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
				<div className='btn-container'>
					<input
						type="submit"
						className="btn-submit"
						value="Зарегистрировать"
						onClick={registrationUser}
					/>
				</div>
			</form>
		</div>
	);
};

export default Registration;
