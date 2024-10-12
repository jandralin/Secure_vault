import React, { useState } from 'react';
import Navbar from './Navbar'

import CryptoForm from './CryptoForm';

const Crypto = () => {
	const [algorithmId, setAlgorithmId] = useState('');

	const handleAlgorithmChange = (id) => {
		setAlgorithmId(id);
	};

	return (
		<div className='container-crypto'>
		 <Navbar onAlgorithmChange={handleAlgorithmChange}/>
		 {algorithmId &&
		 <CryptoForm algorithmId={algorithmId}/>
		 }
		</div>
	)
}

export default Crypto
