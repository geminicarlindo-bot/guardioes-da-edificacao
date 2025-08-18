// frontend/src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateCourseForm from '../components/CreateCourseForm';

function DashboardPage() {
    const [courses, setCourses] = useState([]);
    const { user, profile } = useAuth();
    const [isFormVisible, setIsFormVisible] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axiosInstance.get('/courses/');
                setCourses(response.data);
            } catch (error) {
                console.error("Erro ao buscar cursos", error);
            }
        };
        fetchCourses();
    }, []);

    const handleCourseCreated = (newCourse) => {
        setCourses(prevCourses => [newCourse, ...prevCourses]);
        setIsFormVisible(false);
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <h3>Bem-vindo, {user?.username}! (Perfil: {user?.role})</h3>

            {user?.role === 'aluno' && (
                <div style={{ margin: '20px 0', border: '1px solid green', padding: '15px', borderRadius: '5px' }}>
                    <h4>Seu Progresso</h4>
                    {/* TROQUE 'profile' POR 'user' AQUI */}
                    <p>Nível: {user?.level}</p>
                    <p>XP: {user?.xp} / {user?.level * 500}</p>
                    <p>🪙 Moedas de Reparo: {user?.moedas}</p> 
                    <div style={{ border: '1px solid #ccc', width: '100%', backgroundColor: '#e0e0e0', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ 
                            width: `${(user?.xp / (user.level * 500)) * 100}%`, 
                            height: '20px', 
                            backgroundColor: 'green' 
                        }}></div>
                    </div>
                </div>
            )}

            {user?.role === 'professor' && (
                <div style={{ margin: '20px 0' }}>
                    <button onClick={() => setIsFormVisible(!isFormVisible)}>
                        {isFormVisible ? 'Cancelar' : 'Criar Novo Curso'}
                    </button>
                    {isFormVisible && <CreateCourseForm onCourseCreated={handleCourseCreated} />}
                </div>
            )}

            <h4>Cursos Disponíveis:</h4>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>
                      <Link to={`/curso/${course.id}`}>{course.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DashboardPage;