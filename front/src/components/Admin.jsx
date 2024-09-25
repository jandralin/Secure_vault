// Admin.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './styles/Admin.css'

const Admin = () => {
	return (
		<div className='admin-container'>
		<h3 className='header'>Панель администратора</h3>
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark"> 
				<div className="container-fluid">
						<div className="collapse navbar-collapse" id="navbarNav">
								<ul className="navbar-nav me-auto"> 
										<li className="nav-item">
												<Link to="registration" className="nav-link">Registration</Link>
										</li>
										<li className="nav-item">
												<Link to="users" className="nav-link">Users</Link>
										</li>
								</ul>
								<ul className="navbar-nav ms-auto"> 
										<li className="nav-item">
												<Link to="/login" className="nav-link">Exit</Link>
										</li>
								</ul>
						</div>
				</div>
		</nav>
		<Outlet />
</div>
)};

export default Admin;
