// frontend/src/pages/ProfessorCoursePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProfessorCoursePage() {
    // useParams pega o ':courseId' da URL
    const { courseId } = useParams(); 
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estados para o formulário de nova atividade
    const [showFormForModule, setShowFormForModule] = useState(null);
    const [newActivityTitle, setNewActivityTitle] = useState('');
    const [newActivityType, setNewActivityType] = useState('missao');

    const fetchCourse = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/courses/${courseId}/`);
            setCourse(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar detalhes do curso", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const handleAddActivity = async (e, moduleId) => {
        e.preventDefault();
        const newActivityData = {
            title: newActivityTitle,
            activity_type: newActivityType,
            module: moduleId,
            order: (course.modules.find(m => m.id === moduleId).activities.length) + 1,
        };

        try {
            // Precisamos enviar o token de autenticação
            const tokens = JSON.parse(localStorage.getItem('authTokens'));
            await axios.post('http://127.0.0.1:8000/api/activities/', newActivityData, {
                headers: {
                    'Authorization': `Bearer ${tokens.access}`
                }
            });
            // Limpa o formulário, esconde e busca os dados do curso novamente para atualizar a lista
            setNewActivityTitle('');
            setShowFormForModule(null);
            fetchCourse(); 
        } catch (error) {
            console.error("Erro ao criar atividade", error);
            alert("Falha ao criar atividade.");
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (!course) return <div>Curso não encontrado.</div>;

    return (
        <div>
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <hr />
            <h2>Módulos do Curso</h2>
            {course.modules.map(module => (
                <div key={module.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                    <h3>{module.title} (Ordem: {module.order})</h3>
                    <ul>
                        {module.activities.map(activity => (
                            <li key={activity.id}>{activity.title} ({activity.activity_type})</li>
                        ))}
                    </ul>
                    <button onClick={() => setShowFormForModule(module.id)}>Adicionar Atividade</button>

                    {showFormForModule === module.id && (
                        <form onSubmit={(e) => handleAddActivity(e, module.id)} style={{ marginTop: '10px' }}>
                            <h4>Nova Atividade para "{module.title}"</h4>
                            <input 
                                type="text" 
                                value={newActivityTitle} 
                                onChange={(e) => setNewActivityTitle(e.target.value)} 
                                placeholder="Título da Atividade" 
                                required 
                            />
                            <select value={newActivityType} onChange={(e) => setNewActivityType(e.target.value)}>
                                <option value="missao">Missão</option>
                                <option value="quiz">Quiz</option>
                                <option value="desafio">Desafio</option>
                            </select>
                            <button type="submit">Salvar Atividade</button>
                            <button type="button" onClick={() => setShowFormForModule(null)}>Cancelar</button>
                        </form>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ProfessorCoursePage;