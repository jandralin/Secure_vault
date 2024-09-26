import React, { useState } from 'react';
import './styles/Registration.css';
import { registerUser } from './api/authAPI'; // Убедитесь, что путь правильный

const Registration = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const registrationUser = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

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
    <div className="container mt-5">
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <h2 className="text-center">Регистрация пользователя</h2>
      <form onSubmit={registrationUser}>
        <div className="form-group">
          <label htmlFor="email">Логин</label>
          <input 
            type="email" 
            className="form-control" 
            id="email" 
            placeholder="Введите логин" 
            required
            value={email}
            onChange={e => setEmail(e.target.value)} 
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input 
            type="password" 
            className="form-control" 
            id="password" 
            placeholder="Введите пароль" 
            required
            value={password}
            onChange={e => setPassword(e.target.value)} 
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary btn-block"
        >
          Зарегистрировать
        </button>
      </form>
    </div>
  );
};

export default Registration;
