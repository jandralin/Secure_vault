// Admin.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../styles/Admin.css'

const Admin = () => {
	return (
		<div className='navbar'>
		<div className="navbar-container">
		<a className='navbar-brand'>Панель администратора</a>
		<div className="navbar navbar-expand-lg navbar-dark nav-color"> 
				<div className="container-fluid">
						<div className="collapse navbar-collapse" id="navbarNav">
								<ul className="navbar-nav me-auto"> 
										<li className="nav-item">
												<Link to="registration" className="nav-link">Регистрация</Link>
										</li>
										<li className="nav-item">
												<Link to="users" className="nav-link">Пользователи</Link>
										</li>
								</ul>
								<ul className="navbar-nav ms-auto"> 
										<li className="nav-item">
												<Link to="/login" className="nav-link">Выход</Link>
										</li>
								</ul>
						</div>
				</div>
		</div>
		
		</div><div className="d-flex justify-content-center align-items-center admin">
			<Outlet/>
		</div>
</div>
)};

export default Admin;
