import React, { useEffect, useState } from 'react'
import './styles/Auth.css'
import { useNavigate } from 'react-router-dom';
import { loginUser } from './api/authAPI'

const Auth = () => {
	const [password, setPassword] = useState('')
	const [email, setEmail] = useState('')
	const [linkText, setLinkText] = useState('Забыли пароль?');
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const navigate = useNavigate();
	// Функция обработки клика по ссылке

	useEffect(() => {
		localStorage.removeItem('authToken'); // Удаление authToken
		console.log(localStorage.getItem('authToken')); // Это должно вывести null
	}, []);


	const handleLinkClick = (e) => {
		e.preventDefault(); // Отменяем переход по ссылке
		setLinkText('ЖАЛЬ'); // Изменяем текст ссылки
		e.target.style.textDecoration = 'none'
	};

	// Функция отправки данных
	const handleLogin = async (e) => {
		e.preventDefault();
		setErrorMessage('');
		setSuccessMessage('');

		const loginData = {
			email,
			password,
		};

		try {
			const result = await loginUser(loginData); // Вызов функции логина через axios
			localStorage.setItem('authToken', result.token);
			navigate(result.redirectUrl);
		} catch (error) {
			setErrorMessage(error.message || 'Ошибка авторизации');
			setTimeout(() => {
				setErrorMessage('');
			}, 3000);
		}
	};



	return (
		<div className="container">
			<h2 className="text-center">Авторизация</h2>
			{errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
			{successMessage && <div className="alert alert-success">{successMessage}</div>}
			<form onSubmit={handleLogin}>
				<div className="form-group">
					<label htmlFor="email">Логин</label>
					<input type="email" className="form-control" id="email" placeholder="Введите логин" required
						value={email}
						onChange={e => setEmail(e.target.value)} />
				</div>
				<div className="form-group">
					<label htmlFor="password">Пароль</label>
					<input type="password" className="form-control" id="password" placeholder="Введите пароль" required
						value={password}
						onChange={e => setPassword(e.target.value)} />
				</div>
				<div className="form-group form-check">
				</div>
				<button type="submit" className="btn btn-primary btn-block"
					>Войти</button>
			</form>
			<div className="text-center mt-3">
				<a href="#"
					onClick={handleLinkClick}
				>{linkText}</a>
			</div>
		</div>
	)
}

export default Auth
