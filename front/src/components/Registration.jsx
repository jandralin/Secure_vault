import React, { useState } from 'react'
import './styles/Registration.css'

const Registration = () => {
	const [password, setPassword] = useState('')
	const [email, setEmail] = useState('')
	const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

	// Функция отправки данных
	const registrationUser = async (e) => {
		e.preventDefault(); // Предотвращение перезагрузки страницы
		setErrorMessage(''); // Сброс ошибок перед новой попыткой
    setSuccessMessage(''); // Сброс успешного сообщения
		let registrData = {
			email: email,
			password: password,
		}

		const token = localStorage.getItem('authToken'); // Или другая логика получения токена
		try {
      const response = await fetch('http://localhost:4000/admin/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
        },
        body: JSON.stringify(registrData),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage(result.message || 'Пользователь успешно создан');
				setEmail(''); // Очистка поля email
        setPassword(''); // Очистка поля password
				 // Убираем сообщение через 3 секунды
				 setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setErrorMessage(result.message || 'Ошибка регистрации');
				 // Убираем сообщение через 3 секунды
				 setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    } catch (e) {
      setErrorMessage('Произошла ошибка, попробуйте снова.');
      console.error('Error:', e);
			 // Убираем сообщение через 3 секунды
			 setTimeout(() => {
				setErrorMessage('');
			}, 3000);
    }
  };

	return (
		<div className="container mt-5">
			{/* Вывод сообщений об ошибке или успехе */}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
    <h2 className="text-center">Регистрация пользователя</h2>
    <form>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Электронная почта</label>
            <input type="email" className="form-control" id="email" placeholder="Введите адрес электронной почты" required
						value={email}
						onChange={e => setEmail(e.target.value)}/>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Пароль</label>
            <input type="password" className="form-control" id="password" placeholder="Введите пароль" required
							value={password}
							onChange={e => setPassword(e.target.value)}/>
        </div>
        <button type="submit" className="btn btn-primary"
				onClick={registrationUser}>Зарегистрировать</button>
    </form>
</div>

	)
}

export default Registration
