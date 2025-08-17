// frontend/src/pages/ProfessorCoursePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function ProfessorCoursePage() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isModuleFormVisible, setIsModuleFormVisible] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState('');

    const [showFormForModule, setShowFormForModule] = useState(null);
    const [newActivityTitle, setNewActivityTitle] = useState('');
    const [newActivityType, setNewActivityType] = useState('missao');

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

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const handleCreateModule = async (e) => {
        e.preventDefault();
        const moduleData = {
            title: newModuleTitle,
            course: courseId,
            order: course.modules.length + 1
        };
        try {
            await axiosInstance.post('/modules/', moduleData);
            setNewModuleTitle('');
            setIsModuleFormVisible(false);
            fetchCourse();
        } catch (error) {
            console.error("Erro ao criar módulo", error);
            alert("Falha ao criar módulo.");
        }
    };

    const handleAddActivity = async (e, moduleId) => {
        e.preventDefault();
        const newActivityData = {
            title: newActivityTitle,
            activity_type: newActivityType,
            module: moduleId,
            order: (course.modules.find(m => m.id === moduleId).activities.length) + 1,
        };
        try {
            await axiosInstance.post('/activities/', newActivityData);
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

            <button onClick={() => setIsModuleFormVisible(!isModuleFormVisible)}>
                {isModuleFormVisible ? 'Cancelar' : '+ Adicionar Novo Módulo'}
            </button>
            {isModuleFormVisible && (
                <form onSubmit={handleCreateModule} style={{ border: '1px solid purple', padding: '10px', margin: '10px 0' }}>
                    <h4>Novo Módulo</h4>
                    <input
                        type="text"
                        value={newModuleTitle}
                        onChange={(e) => setNewModuleTitle(e.target.value)}
                        placeholder="Título do Módulo"
                        required
                    />
                    <button type="submit">Salvar Módulo</button>
                </form>
            )}

            <h2>Módulos do Curso</h2>
            {course.modules.map(module => (
                <div key={module.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                    <h3>{module.title} (Ordem: {module.order})</h3>
                    {module.activities.length > 0 ? (
                        <ul>
                            {module.activities.map(activity => (
                                <li key={activity.id}>{activity.title} ({activity.activity_type})</li>
                            ))}
                        </ul>
                    ) : <p>Nenhuma atividade neste módulo.</p>}
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