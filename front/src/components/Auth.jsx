import React, { useEffect, useState } from 'react';
import './styles/Auth.css';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './api/authAPI';
import { jwtDecode } from 'jwt-decode';

const Auth = () => {
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [linkText, setLinkText] = useState('Забыли пароль?');
	const [errorMessage, setErrorMessage] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		localStorage.clear(); // Удаление authToken
		console.log(localStorage.getItem('authToken')); // Это должно вывести null
	}, []); // Добавляем dispatch в зависимости


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
			const decodedToken = jwtDecode(result.token); // Декодируем токен
			localStorage.setItem('userId', decodedToken.userId);	
			console.log('User ID :', decodedToken.userId);
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
			<h2 className="header">АВТОРИЗАЦИЯ</h2>
			<div className='messages'>
			{errorMessage && <div className=" alert alert-danger">{errorMessage}</div>}
			{successMessage && <div className=" alert alert-success">{successMessage}</div>}</div>
			<form className="form-container" onSubmit={handleLogin}>
				<div className="form">
					<input type="email" className="form-input" id="email" placeholder="email" required
						value={email}
						onChange={e => setEmail(e.target.value)} />
				</div>
				<div className="form">
					<input type="password" className="form-input" id="password" placeholder="пароль" required
						value={password}
						onChange={e => setPassword(e.target.value)} />
				</div>
				<div className='btn-container'>
				<input type="submit" className="btn-submit" value="Войти" onClick={handleLogin}/>
				</div>
			</form>
		</div>
	);
}

export default Auth;
