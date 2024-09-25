import React, { useState } from 'react'
import './styles/Auth.css'

const Auth = () => {
	const [linkText, setLinkText] = useState('Забыли пароль?');

	// Функция обработки клика по ссылке
	const handleLinkClick = (e) => {
		e.preventDefault(); // Отменяем переход по ссылке
		setLinkText('ЖАЛЬ'); // Изменяем текст ссылки
		e.target.style.textDecoration = 'none'
	};



	return (
		<div class="container">
			<h2 class="text-center">Авторизация</h2>
			<form>
				<div class="form-group">
					<label for="email">Логин</label>
					<input type="email" class="form-control" id="email" placeholder="Введите логин" required />
				</div>
				<div class="form-group">
					<label for="password">Пароль</label>
					<input type="password" class="form-control" id="password" placeholder="Введите пароль" required />
				</div>
				<div class="form-group form-check">
				</div>
				<button type="submit" class="btn btn-primary btn-block">Войти</button>
			</form>
			<div class="text-center mt-3">
				<a href="#"
					onClick={handleLinkClick}
				>{linkText}</a>
			</div>
		</div>
	)
}

export default Auth
