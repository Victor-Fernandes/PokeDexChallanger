import React from 'react';
import { Pokemon } from '../../interfaces/pokemon.interface';
import './PokemonDetail.css';

interface PokemonDetailProps {
  pokemon: Pokemon | null; 
  onClose: () => void;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon, onClose }) => {
  if (!pokemon) {
    return null;
  }
  
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
            
            <div className="pokemon-detail-basic-info">
              <h2>#{pokemon.pokemon_number} {pokemon.name}</h2>
              
              {}
              <div className="pokemon-detail-types">
                {pokemon.types.map((type, index) => (
                  <span key={index} className={`type ${type.toLowerCase()}`}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {}
          <div className="pokemon-detail-description">
            <h3>Descrição</h3>
            <p>{pokemon.description}</p>
          </div>
          
          {}
          <div className="pokemon-detail-physical">
            <h3>Características Físicas</h3>
            <p><strong>Altura:</strong> {pokemon.height / 10}m</p>
            <p><strong>Peso:</strong> {pokemon.weight / 10}kg</p>
          </div>
          
          {}
          <div className="pokemon-detail-moves">
            <h3>Movimentos</h3>
            <ul>
              {pokemon.moves.map((move: string, index: number) => (
                <li key={index}>{move}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
