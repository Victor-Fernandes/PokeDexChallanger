import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Pokédex</h1>
        <p>Encontre informações sobre seus Pokémon favoritos!</p>
      </div>
    </header>
  );
};

export default Header;
