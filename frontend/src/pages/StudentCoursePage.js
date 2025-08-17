// frontend/src/pages/StudentCoursePage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

function StudentCoursePage() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const { setProfile } = useAuth();

    const handleCompleteActivity = async (activityId) => {
        try {
            const response = await axiosInstance.post('/gamification/complete-activity/', {
                activity_id: activityId
            });
            alert(response.data.message);
            // Atualiza o perfil no contexto global para refletir os novos dados
            setProfile(prevProfile => ({
                ...prevProfile,
                xp: response.data.new_xp,
                level: response.data.new_level,
                moedas: response.data.new_moedas, // ADICIONE ESTA LINHA
            }));
        } catch (error) {
            console.error("Erro ao completar atividade", error);
            alert(error.response?.data?.error || "Falha ao completar atividade.");
        }
    };

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axiosInstance.get(`/courses/${courseId}/`);
                setCourse(response.data);
            } catch (error) {
                console.error("Erro ao buscar detalhes do curso", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    if (loading) return <div>Carregando...</div>;
    if (!course) return <div>Curso não encontrado.</div>;

    return (
        <div>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <hr />
            <h2>Sua Trilha de Aprendizagem</h2>
            {course.modules.map(module => (
                <div key={module.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                    <h3>{module.title}</h3>
                    {module.activities.length > 0 ? (
                        <ul>
                            {module.activities.map(activity => (
                                <li key={activity.id} style={{ marginBottom: '5px' }}>
                                    {activity.title} ({activity.activity_type})
                                    <button onClick={() => handleCompleteActivity(activity.id)} style={{ marginLeft: '10px' }}>
                                        Concluir
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nenhuma atividade neste módulo ainda.</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default StudentCoursePage;