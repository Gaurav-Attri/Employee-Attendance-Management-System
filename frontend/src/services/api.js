import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const loginRequest = (credentials) => {
    return api.post('/api/auth/login', credentials);
}

export default api;