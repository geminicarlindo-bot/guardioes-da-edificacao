// frontend/src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateCourseForm from '../components/CreateCourseForm';

function DashboardPage() {
    const [courses, setCourses] = useState([]);
    // A LINHA CORRIGIDA ESTÁ AQUI: Adicionamos o 'profile' de volta
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

            {/* Lógica do Aluno para exibir o progresso */}
            {user?.role === 'aluno' && profile && (
                <div style={{ margin: '10px 0', border: '1px solid green', padding: '10px' }}>
                    <h4>Seu Progresso</h4>
                    <p>Nível: {profile.level}</p>
                    <p>XP: {profile.xp} / {profile.level * 500}</p>
                    <div style={{ border: '1px solid #ccc', width: '100%', backgroundColor: '#e0e0e0' }}>
                        <div style={{ 
                            width: `${(profile.xp / (profile.level * 500)) * 100}%`, 
                            height: '20px', 
                            backgroundColor: 'green' 
                        }}></div>
                    </div>
                </div>
            )}

            {/* Lógica do Professor para criar cursos */}
            {user?.role === 'professor' && (
                <>
                    <button onClick={() => setIsFormVisible(!isFormVisible)}>
                        {isFormVisible ? 'Cancelar' : 'Criar Novo Curso'}
                    </button>
                    {isFormVisible && <CreateCourseForm onCourseCreated={handleCourseCreated} />}
                </>
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