// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(/* ... */);
    const [user, setUser] = useState(/* ... */);

    // Perfil agora é derivado diretamente do token!
    const [profile, setProfile] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null);

    const loginUser = async (email, password) => {
        const response = await axiosInstance.post('/auth/login/', { email, password });
        if (response.status === 200) {
            setAuthTokens(response.data);
            const decodedToken = jwtDecode(response.data.access);
            setUser(decodedToken);
            setProfile(decodedToken); // Seta o perfil com os dados do token
            localStorage.setItem('authTokens', JSON.stringify(response.data));
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        setProfile(null); // Limpa o perfil no logout
        localStorage.removeItem('authTokens');
    };

    // Efeito para buscar o perfil quando o usuário logar
    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                // Precisamos de uma API para buscar o perfil - VAMOS CRIAR ISSO NO BACKEND
                // Por enquanto vamos simular
                setProfile({ xp: 0, level: 1 });
            }
        };
        fetchProfile();
    }, [user]);

    const value = { user, profile, setProfile, loginUser, logoutUser };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};