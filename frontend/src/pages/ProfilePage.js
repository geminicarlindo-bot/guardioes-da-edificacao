// frontend/src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Avatar from '../components/Avatar';

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const response = await axiosInstance.get('/auth/profile/');
            setProfile(response.data);
        } catch (error) {
            console.error("Erro ao buscar perfil", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEquip = async (itemId) => {
        try {
            await axiosInstance.post('/store/equip/', { item_id: itemId });
            alert("Item equipado!");
            fetchProfile();
        } catch (error) {
            alert(error.response?.data?.error || "Falha ao equipar item.");
        }
    };

    // NOVA FUNÇÃO PARA DESEQUIPAR
    const handleUnequip = async (itemType) => {
        try {
            await axiosInstance.post('/store/unequip/', { item_type: itemType });
            alert("Item removido!");
            fetchProfile();
        } catch (error) {
            alert(error.response?.data?.error || "Falha ao remover item.");
        }
    };

    if (loading) return <div>Carregando perfil...</div>;

    return (
        <div>
            <h2>Perfil de {profile?.user}</h2>
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <Avatar profile={profile} />
                </div>
                <div style={{ flex: 2, paddingLeft: '20px' }}>
                    <h3>Vestiário / Inventário</h3>
                    <h4>Itens Adquiridos:</h4>
                    {profile?.inventory.length > 0 ? (
                        <ul>
                            {profile.inventory.map(({ item }) => {
                                // Verifica se o item atual está equipado
                                const isEquipped = profile[`equipped_${item.item_type}`]?.id === item.id;

                                return (
                                    <li key={item.id}>
                                        {item.name} ({item.item_type})

                                        {/* LÓGICA DO BOTÃO ATUALIZADA */}
                                        {isEquipped ? (
                                            <button onClick={() => handleUnequip(item.item_type)} style={{ marginLeft: '10px', backgroundColor: '#ffcccb' }}>
                                                Remover
                                            </button>
                                        ) : (
                                            <button onClick={() => handleEquip(item.id)} style={{ marginLeft: '10px' }}>
                                                Equipar
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p>Você ainda não comprou nenhum item na loja.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;