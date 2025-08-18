// frontend/src/components/Avatar.js
import React from 'react';

function Avatar({ profile }) {
    // Estilos para o container e para as camadas de imagem
    const avatarStyle = {
        position: 'relative',
        width: '200px',
        height: '300px',
        margin: '0 auto'
    };

    const layerStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    };

    return (
        <div style={avatarStyle}>
            {/* Camada Base */}
            <img src="/assets/corpo_base.png" alt="Corpo" style={{ ...layerStyle, zIndex: 0 }} />

            {/* Camadas de Itens Equipados */}
            {profile?.equipped_luva && <img src={`/assets/${profile.equipped_luva.asset_url}`} alt="Luva" style={{ ...layerStyle, zIndex: 1 }} />}
            {profile?.equipped_ferramenta && <img src={`/assets/${profile.equipped_ferramenta.asset_url}`} alt="Ferramenta" style={{ ...layerStyle, zIndex: 2 }} />}
            {profile?.equipped_capacete && <img src={`/assets/${profile.equipped_capacete.asset_url}`} alt="Capacete" style={{ ...layerStyle, zIndex: 3 }} />}
        </div>
    );
}

export default Avatar;