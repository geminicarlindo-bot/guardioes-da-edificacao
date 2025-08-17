// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage'; // Importe nosso gerenciador

function App() {
    const { user, logoutUser } = useAuth();

    return (
        <Router>
            <div>
                <nav>
                    {user ? (
                        <>
                            <Link to="/">Dashboard</Link>
                            <button onClick={logoutUser} style={{marginLeft: '10px'}}>Sair</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link> | <Link to="/register">Cadastre-se</Link>
                        </>
                    )}
                </nav>
                <hr />
                <Routes>
                    <Route path="/" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
                    <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                    <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/" />} />
                    <Route path="/curso/:courseId" element={user ? <CoursePage /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;