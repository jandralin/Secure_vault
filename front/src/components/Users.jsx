import React, { useState, useEffect } from 'react';
import './styles/Users.css'; // Импорт стилей
import { fetchUsers } from './api/authAPI'; // Убедитесь, что путь к файлу правильный

const Users = () => {
  const [users, setUsers] = useState([]); // Состояние для хранения пользователей
  const [errorMessage, setErrorMessage] = useState(''); // Состояние для хранения сообщений об ошибках

  // Функция для получения списка пользователей с сервера
  const loadUsers = async () => {
		try {
		const token = localStorage.getItem('authToken'); // Получение токена авторизации
		const usersData = await fetchUsers(token); // Используем fetchUsers для получения данных
      
      setUsers(usersData); // Устанавливаем список пользователей
    } catch (error) {
      // Обработка ошибок
      setErrorMessage(error.message || 'Ошибка при получении пользователей');
    }
  };

  // Используем useEffect для загрузки пользователей при монтировании компонента
  useEffect(() => {
    loadUsers(); // Вызываем функцию загрузки
  }, []); // Пустой массив зависимостей, чтобы вызов произошел только при монтировании

  return (
    <div className="user-container mt-5">
      <h3 className="text-center mb-3">Список пользователей</h3>

      {/* Вывод ошибки */}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      {/* Таблица пользователей */}
      {users.length > 0 ? (
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Роль</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !errorMessage && <div className="text-center">Загрузка данных...</div>
      )}
    </div>
  );
};

export default Users;
