import React from 'react';
import Auth from './components/Auth';
import './components/styles/App.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import Crypto from './components/Crypto';
import Admin from './components/Admin';
import {PrivateRoute }from './components/PrivateRoute';
import Unauthorized from './components/Unauthorized';
import Registration from './components/Registration';
import Users from './components/Users';
import { AuthRoute } from './components/PrivateRoute';

const App = () => {
	return (
		<div className="app-container">
			<Routes>
			<Route path="/" element={<Navigate to='login'/>} />
				<Route path="login" element={<Auth />} />
				<Route path="crypto" element={<AuthRoute element={Crypto} />} />
				<Route path="unauthorized" element={<Unauthorized />} />
				<Route path="admin" element={<PrivateRoute element={Admin} />}>
					<Route path="registration" element={<Registration />} />
					<Route path="users" element={<Users />} />
				</Route>
			</Routes>
		</div>
	);
};

export default App;