// frontend/src/pages/StorePage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

function StorePage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, setUser } = useAuth(); // TROQUE 'profile' e 'setProfile' por 'user' e 'setUser'

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
            // ATUALIZE a chamada para setUser
            setUser(prevUser => ({ ...prevUser, moedas: response.data.new_moedas }));
        } catch (error) {
            alert(error.response?.data?.error || "Falha na compra.");
        }
    };

    if (loading) return <div>Carregando loja...</div>;

    return (
        <div>
            <h2>🛒 Loja do Mestre de Obras</h2>
            {/* A interrogação aqui protege contra o erro */}
            <p>Seu saldo: 🪙 {user?.moedas} Moedas de Reparo</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {items.map(item => (
                    <div key={item.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', width: '200px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ height: '150px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img 
                                    src={`/assets/${item.asset_url}`} 
                                    alt={item.name} 
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                                />
                            </div>
                            <h4>{item.name}</h4>
                            <p style={{ fontSize: '0.9em', color: '#555' }}>{item.description}</p>
                        </div>
                        <div>
                            <p><strong>Preço: 🪙 {item.price}</strong></p>
                            <button onClick={() => handlePurchase(item.id)} style={{ width: '100%', padding: '8px', cursor: 'pointer' }}>Comprar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StorePage;