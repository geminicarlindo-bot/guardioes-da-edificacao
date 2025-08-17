// frontend/src/api/axiosInstance.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const baseURL = 'http://127.0.0.1:8000/api/';

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: { 'Content-Type': 'application/json' }
});

// Interceptor para ADICIONAR o token a cada requisição
axiosInstance.interceptors.request.use(async req => {
    const tokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;

    if (!tokens) return req;

    const user = jwtDecode(tokens.access);
    const isExpired = new Date(user.exp * 1000) < new Date();

    if (!isExpired) {
        req.headers.Authorization = `Bearer ${tokens.access}`;
        return req;
    }

    // Se o Access Token expirou, tenta renová-lo
    try {
        const response = await axios.post(`${baseURL}auth/login/refresh/`, {
            refresh: tokens.refresh
        });

        localStorage.setItem('authTokens', JSON.stringify(response.data));
        req.headers.Authorization = `Bearer ${response.data.access}`;
        return req;
    } catch (error) {
        // Se o Refresh Token também falhar, limpa tudo
        localStorage.removeItem('authTokens');
        // Redireciona para o login (opcional, mas recomendado)
        window.location.href = '/login';
        return Promise.reject(error);
    }
});

export default axiosInstance;