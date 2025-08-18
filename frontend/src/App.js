// frontend/src/App.js
import React from 'react';
// REMOVA A IMPORTAÇÃO DO ROUTER DAQUI
import { Route, Routes, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Importações de todas as páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';
import ProfilePage from './pages/ProfilePage'; // A LINHA FALTANTE ESTAVA AQUI
import RankingPage from './pages/RankingPage';
import StorePage from './pages/StorePage';

function App() {
    const { user, logoutUser } = useAuth();

    return (
        // REMOVA A TAG <Router> DAQUI
        <div>
            <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '15px' }}>
                {user ? (
                    <>
                        <Link to="/" style={{ marginRight: '10px' }}>Dashboard</Link>
                        <Link to="/perfil" style={{ marginRight: '10px' }}>Meu Perfil</Link>
                        <Link to="/ranking" style={{ marginRight: '10px' }}>Ranking</Link>
                        <Link to="/loja" style={{ marginRight: '10px' }}>Loja</Link>
                        <button onClick={logoutUser} style={{ marginLeft: '10px' }}>Sair</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                        <Link to="/register">Cadastre-se</Link>
                    </>
                )}
            </nav>
            <hr />
            <Routes>
                <Route path="/" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
                <Route path="/curso/:courseId" element={user ? <CoursePage /> : <Navigate to="/login" />} />
                <Route path="/perfil" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
                <Route path="/ranking" element={user ? <RankingPage /> : <Navigate to="/login" />} />
                <Route path="/loja" element={user ? <StorePage /> : <Navigate to="/login" />} />
            </Routes>
        </div>
        // REMOVA A TAG </Router> DAQUI
    );
}

export default App;