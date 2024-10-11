import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/crypto',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchAlgorithms = async (token) => {
  try {
    const response = await api.get('/algorithms', {
      headers: {
        'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const fetchKeys = async ( userId, algorithmId , token) => {
  try {
    const response = await api.get('/keys', {
      headers: {
        'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
      },
			params: { // Параметры передаем через params
        userId,
        algorithmId,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};


export const fetchMessages = async ( userId, algorithmId , token) => {
  try {
    const response = await api.get('/encrypted', {
      headers: {
        'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
      },
			params: { // Параметры передаем через params
        userId,
        algorithmId,
      },
    });
		console.log( response.data)
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};


export const encryptMessage = async (userId, encryptionKeyId, message, algorithmId, token) => {
  try {
    const response = await api.post('/encrypt', {
      userId,
      encryptionKeyId,
      message,
      algorithmId,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const decryptMessage = async (userId, encryptionKeyId, message, algorithmId, token) => {
  try {
    const response = await api.post('/decrypt', {
      userId,
      encryptionKeyId,
      message,
      algorithmId,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};


export const createRSAKey = async (userId, bits, token) => {
  try {
    const response = await api.post('/keys/create/rsa', {
      userId,
      bits
    }, {
      headers: {
        'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const createRoundKey = async (userId, roundKeys, token) => {
	console.log('nen');
  try {
    const response = await api.post('/keys/create/round', {
      userId,
      roundKeys
    }, {
      headers: {
        'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const signText = async (text, token) => {
  try {
    const response = await api.post('/sign', {
      text
    }, {
      headers: {
        'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
      },
			responseType: 'blob',
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const verify = async (formData, token) => {
  try {
    const response = await api.post('/verify', {
      formData
    }, {
      headers: {
        'Authorization': `Bearer ${token}`, // Добавляем токен в заголовок
				'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

