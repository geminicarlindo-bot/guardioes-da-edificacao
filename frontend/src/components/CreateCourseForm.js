// frontend/src/components/CreateCourseForm.js
import React, { useState } from 'react';
import axios from 'axios';

function CreateCourseForm({ onCourseCreated }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const courseData = { title, description };

        try {
            const tokens = JSON.parse(localStorage.getItem('authTokens'));
            const response = await axios.post('http://127.0.0.1:8000/api/courses/', courseData, {
                headers: {
                    'Authorization': `Bearer ${tokens.access}`
                }
            });
            alert('Curso criado com sucesso!');
            onCourseCreated(response.data); // Envia o novo curso de volta para o Dashboard
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error("Erro ao criar curso", error);
            alert("Falha ao criar curso.");
        }
    };

    return (
        <div style={{ border: '1px solid blue', padding: '15px', margin: '15px 0' }}>
            <h3>Criar Novo Curso</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título:</label><br />
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ width: '90%' }}
                    />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <label>Descrição:</label><br />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={{ width: '90%', height: '80px' }}
                    />
                </div>
                <button type="submit" style={{ marginTop: '10px' }}>Salvar Curso</button>
            </form>
        </div>
    );
}

export default CreateCourseForm;