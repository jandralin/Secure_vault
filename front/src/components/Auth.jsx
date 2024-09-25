import React, { useState } from 'react'
import './styles/Auth.css'
import {useNavigate} from 'react-router-dom';

const Auth = () => {
	const [password, setPassword] = useState('')
	const [email, setEmail] = useState('')
	const [linkText, setLinkText] = useState('Забыли пароль?');
	const [errorMessage, setErrorMessage] = useState('');
	const navigate = useNavigate();

	// Функция обработки клика по ссылке
	const handleLinkClick = (e) => {
		e.preventDefault(); // Отменяем переход по ссылке
		setLinkText('ЖАЛЬ'); // Изменяем текст ссылки
		e.target.style.textDecoration = 'none'
	};

	// Функция отправки данных
	const loginUser = async (e) => {
		e.preventDefault()

		let loginData = {
			email: email,
			password: password,
		}

		try {
			 const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

			
			if (response.ok) {
        localStorage.setItem('authToken', result.token);
        navigate(result.redirectUrl); 
      } else {
        setErrorMessage(result.message || 'Ошибка авторизации');
      }
    } catch (error) {
      setErrorMessage('Произошла ошибка, попробуйте снова.');
      console.error('Error:', error);
    }
	}



	return (
		<div className="container">
			<h2 className="text-center">Авторизация</h2>
			<form>
				<div className="form-group">
					<label htmlFor="email">Логин</label>
					<input type="email" className="form-control" id="email" placeholder="Введите логин" required 
					value={email}
					onChange={e => setEmail(e.target.value)}/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Пароль</label>
					<input type="password" className="form-control" id="password" placeholder="Введите пароль" required 
					value={password}
					onChange={e => setPassword(e.target.value)}/>
				</div>
				<div className="form-group form-check">
				</div>
				<button type="submit" className="btn btn-primary btn-block"
				onClick={loginUser}>Войти</button>
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
