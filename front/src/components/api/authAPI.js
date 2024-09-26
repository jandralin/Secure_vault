import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});


export const loginUser = async (loginData) => {
  try {
    const response = await api.post('/login', loginData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};


export const registerUser = async (registrationData, token) => {
  try {
    const response = await api.post('/admin/registration', registrationData, {
      headers: {
        'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};


export const fetchUsers = async (token) => {
  try {
    const response = await api.get('/admin/users', { // Используем api для запроса
      headers: {
        'Authorization': `Bearer ${token}`, // Передача токена в заголовке
      },
    });
    console.log(response.data); // Логируем полученные данные для отладки
    return response.data; // Возвращаем данные ответа
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error'); // Обработка ошибок
  }
};