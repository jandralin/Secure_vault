import React from 'react';
import Auth from './components/Auth';
import './components/styles/App.css'
import { Route, Routes } from 'react-router-dom';
import Crypto from './components/Crypto';
import Admin from './components/Admin';
import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './components/Unauthorized';
import Registration from './components/Registration';
import Users from './components/Users';

const App = () => {
	return (
		<div className="app-container">
			<Routes>
				<Route path="/login" element={<Auth />} />
				<Route path="/crypto" element={<Crypto />} />
				<Route path="/unauthorized" element={<Unauthorized />} />
				<Route path="/admin" element={<PrivateRoute element={Admin} />}>
					<Route path="registration" element={<Registration />} />
					<Route path="users" element={<Users />} />
				</Route>
			</Routes>
		</div>
	);
};

export default App;