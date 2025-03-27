import React from 'react';
import { Pokemon } from '../../interfaces/pokemon.interface';
import './PokemonCard.css';


interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void; 
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  return (
    <div className="pokemon-card" onClick={onClick}>
      {}
      <div className="pokemon-image">
        <img src={pokemon.imageUrl} alt={`Pokémon ${pokemon.name}`} />
      </div>
      
      {}
      <div className="pokemon-info">
        {}
        <h2>#{pokemon.pokemon_number} {pokemon.name}</h2>
        
        {}
        <div className="pokemon-types">
          {pokemon.types.map((type, index) => (
            <span key={index} className={`type ${type.toLowerCase()}`}>
              {type}
            </span>
          ))}
        </div>
        
        {}
        <div className="pokemon-details">
          <p><strong>Altura:</strong> {pokemon.height / 10}m</p>
          <p><strong>Peso:</strong> {pokemon.weight / 10}kg</p>
        </div>
        
        {}
        <div className="pokemon-moves">
          <p><strong>Movimentos:</strong></p>
          <ul>
            {pokemon.moves.slice(0, 3).map((move, index) => (
              <li key={index}>{move}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
