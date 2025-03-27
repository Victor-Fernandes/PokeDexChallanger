import React, { useState } from 'react';
import { Pokemon } from '../../interfaces/pokemon.interface';
import PokemonEditForm from '../PokemonEditForm/PokemonEditForm';
import './PokemonDetail.css';

interface PokemonDetailProps {
  pokemon: Pokemon | null; 
  onClose: () => void;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon, onClose }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  
  if (!pokemon) {
    return null;
  }
  
  const handleEditClick = () => {
    setShowEditForm(true);
  };
  
  const handleEditCancel = () => {
    setShowEditForm(false);
  };
  
  const handlePokemonUpdated = () => {
    setShowEditForm(false);
    // Idealmente, deveríamos atualizar o Pokémon no estado do PokemonList
    // Mas para simplificar, vamos apenas fechar o modal
    onClose();
  };

  return (
    <div className="pokemon-detail-overlay">
      <div className="pokemon-detail-modal">
        {}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        
        <div className="pokemon-detail-content">
          {}
          <div className="pokemon-detail-header">
            <div className="pokemon-detail-image">
              <img src={pokemon.imageUrl} alt={`Pokémon ${pokemon.name}`} />
            </div>
            <div className="pokemon-detail-info">
              <h2>{pokemon.name}</h2>
              <p className="pokemon-number">#{pokemon.pokemon_number}</p>
              <div className="pokemon-types">
                {pokemon.types.map((type, index) => (
                  <span key={index} className={`type-badge ${type}`}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pokemon-detail-body">
            <div className="pokemon-description">
              <h3>Descrição</h3>
              <p>{pokemon.description}</p>
            </div>
            
            <div className="pokemon-stats">
              <div className="stat">
                <span className="stat-label">Altura:</span>
                <span className="stat-value">{pokemon.height / 10} m</span>
              </div>
              <div className="stat">
                <span className="stat-label">Peso:</span>
                <span className="stat-value">{pokemon.weight / 10} kg</span>
              </div>
            </div>
            
            <div className="pokemon-moves">
              <h3>Movimentos</h3>
              <ul>
                {pokemon.moves.map((move, index) => (
                  <li key={index}>{move}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pokemon-detail-actions">
            <button 
              className="edit-button" 
              onClick={handleEditClick}
            >
              Editar Pokémon
            </button>
          </div>
        </div>
      </div>
      
      {showEditForm && (
        <PokemonEditForm 
          pokemon={pokemon}
          onPokemonUpdated={handlePokemonUpdated}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
};

export default PokemonDetail;
