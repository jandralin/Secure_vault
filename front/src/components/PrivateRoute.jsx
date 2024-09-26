import React from 'react';
import {jwtDecode} from 'jwt-decode'; // Исправляем импорт, убираем { }
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ element: Component, ...rest }) => {
    const token = localStorage.getItem('authToken');
    let isAdmin = false;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            isAdmin = decodedToken.role === 'ADMIN';
        } catch (error) {
            console.error('Ошибка при декодировании токена:', error);
        }
    }

    // Обратите внимание, что мы рендерим JSX компонент через <Component />
    return isAdmin ? <Component {...rest} /> : <Navigate to="/unauthorized" />;
};

export const AuthRoute = ({ element: Component, ...rest }) => {
	const token = localStorage.getItem('authToken');
	let isAuth = Boolean(token);

	return isAuth ? <Component {...rest} /> : <Navigate to="/unauthorized" />;
};

