// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    // Pega os tokens da "caixa" (localStorage)
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    );

    // Abre a caixa, pega o token de acesso e decodifica para obter os dados do usuário
    const [user, setUser] = useState(() => 
        localStorage.getItem('authTokens') ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access) : null
    );

    const navigate = useNavigate();

    const loginUser = async (email, password) => {
        const response = await axiosInstance.post('/auth/login/', { email, password });
        if (response.status === 200) {
            setAuthTokens(response.data);
            // Após o login, decodificamos o novo token de acesso para pegar os dados
            setUser(jwtDecode(response.data.access)); 
            localStorage.setItem('authTokens', JSON.stringify(response.data));
            navigate('/');
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
    };

    // Agora o 'value' tem o 'user' (que contém tudo) e o 'setUser' para permitir atualizações
    const value = { user, authTokens, setUser, loginUser, logoutUser };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};