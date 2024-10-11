import React, { useState, useEffect } from 'react';
import { fetchAlgorithms } from '../api/cryptoAPI';
import '../styles/Navbar.css'
import { Link } from 'react-router-dom';

const Navbar = ({ onAlgorithmChange }) => {
	const [algorithms, setAlgorithms] = useState([]);
	const [errorMessage, setErrorMessage] = useState('');

	const getAlgorithms = async () => {
		try {
			const token = localStorage.getItem('authToken');
			const algData = await fetchAlgorithms(token);
			setAlgorithms(algData);
		} catch (error) {
			setErrorMessage(error.message || 'Ошибка при получении алгоритмов');
		}
	};

	useEffect(() => {
		getAlgorithms();
	}, []);

	const handleAlgorithmChange = (event) => {
		const selectedId = event.target.value;
		console.log(selectedId)
		onAlgorithmChange(selectedId); // Обновляем родительское состояние
		localStorage.setItem('algorithmId', selectedId)
		localStorage.removeItem('encryptedKeyId')
		console.log('Selected Algorithm ID:', selectedId); // Логирование выбранного ID
};

	return (
		<nav className="navbar">
		<div className="navbar-container">
				<a className="navbar-brand">Алгоритмы шифрования</a>
				<select className="navbar-select"
				onChange={handleAlgorithmChange}>
						<option 
						value=""
						className="navbar-item"
						>Выберите алгоритм</option> {/* Начальный элемент */}
						{algorithms.map(elem => (
								<option className="item" key={elem.id} value={elem.id}>
										{elem.name}
								</option>
						))}
				</select>
			{errorMessage && <div className="error-message">{errorMessage}</div>}
			<Link to="/login" className="nav-link">Выход</Link>
		</div>
</nav>
	);
};

export default Navbar;
