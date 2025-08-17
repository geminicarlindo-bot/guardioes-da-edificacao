// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await loginUser(email, password);
            navigate('/'); // Redireciona para a página inicial/dashboard após o login
        } catch (error) {
            console.error('Erro no login!', error);
            alert('Email ou senha inválidos.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Senha:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default LoginPage;