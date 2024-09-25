import React, { useState, useEffect } from 'react';
import './styles/Users.css'

const Users = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Функция для получения списка пользователей с сервера
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken'); // Получение токена авторизации
      const response = await fetch('http://localhost:4000/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`, // Передача токена в заголовке
        },
      });
      const data = await response.json();

      if (response.ok) {
        setUsers(data); // Устанавливаем список пользователей
      } else {
        setErrorMessage('Ошибка при получении пользователей');
      }
    } catch (error) {
      setErrorMessage('Ошибка соединения с сервером');
    }
  };

  // Используем useEffect для загрузки данных при первом рендере компонента
  useEffect(() => {
    fetchUsers();
  }, []);

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

export default Users
