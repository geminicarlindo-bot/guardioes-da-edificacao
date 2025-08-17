// frontend/src/pages/RegisterPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('aluno');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/auth/register/', {
                username,
                email,
                password,
                role
            });
            alert('Cadastro realizado com sucesso! Faça o login.');
            navigate('/login'); // Redireciona para a página de login
        } catch (error) {
            console.error('Erro no cadastro!', error);
            alert('Falha no cadastro. Verifique os dados.');
        }
    };

    return (
        <div>
            <h2>Cadastro</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome de Usuário:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Senha:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Eu sou:</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="aluno">Aluno</option>
                        <option value="professor">Professor</option>
                    </select>
                </div>
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
}

export default RegisterPage;