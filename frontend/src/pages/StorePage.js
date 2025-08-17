// frontend/src/pages/StorePage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

function StorePage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { profile, setProfile } = useAuth(); // Usaremos para atualizar as moedas

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axiosInstance.get('/store/items/');
                setItems(response.data);
            } catch (error) {
                console.error("Erro ao buscar itens da loja", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const handlePurchase = async (itemId) => {
        try {
            const response = await axiosInstance.post('/store/purchase/', { item_id: itemId });
            alert(response.data.message);
            // Atualiza o saldo de moedas no contexto global
            setProfile(prev => ({ ...prev, moedas: response.data.new_moedas }));
        } catch (error) {
            alert(error.response?.data?.error || "Falha na compra.");
        }
    };

    if (loading) return <div>Carregando loja...</div>;

    return (
        <div>
            <h2>🛒 Loja do Mestre de Obras</h2>
            <p>Seu saldo: 🪙 {profile?.moedas} Moedas de Reparo</p>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {items.map(item => (
                    <div key={item.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', width: '200px' }}>
                        <h4>{item.name}</h4>
                        <p>{item.description}</p>
                        <p><strong>Preço: 🪙 {item.price}</strong></p>
                        <button onClick={() => handlePurchase(item.id)}>Comprar</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StorePage;