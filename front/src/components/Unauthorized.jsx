import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Unauthorized.css'

const Unauthorized = () => {
	const navigate = useNavigate()
	return (
		<div className='un-contsiner'>  
			<button className='btn btn-primary'
			onClick={e => navigate('/login')}>RETURN
			</button>Доступ запрещен. У вас нет прав для доступа к этой странице. 
		</div>)
};

export default Unauthorized;