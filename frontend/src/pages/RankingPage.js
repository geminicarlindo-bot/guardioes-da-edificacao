// frontend/src/pages/RankingPage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

function RankingPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axiosInstance.get('/gamification/leaderboard/');
                setLeaderboard(response.data);
            } catch (error) {
                console.error("Erro ao buscar o ranking", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    if (loading) return <div>Carregando ranking...</div>;

    return (
        <div>
            <h2>🏆 Ranking dos Guardiões 🏆</h2>
            <ol>
                {leaderboard.map((profile, index) => (
                    <li key={index}>
                        <strong>{profile.username}</strong> - Nível: {profile.level} | XP: {profile.xp}
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default RankingPage;