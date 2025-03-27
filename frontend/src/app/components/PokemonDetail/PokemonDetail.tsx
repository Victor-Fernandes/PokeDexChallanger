import React, { useState } from 'react';
import { Pokemon } from '../../interfaces/pokemon.interface';
import PokemonEditForm from '../PokemonEditForm/PokemonEditForm';
import { PokemonService } from '../../services/pokemon.service';
import './PokemonDetail.css';

interface PokemonDetailProps {
  pokemon: Pokemon | null; 
  onClose: () => void;
  onPokemonDeleted?: () => void;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon, onClose, onPokemonDeleted }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  
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
    onClose();
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!pokemon) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const pokemonService = new PokemonService();
      await pokemonService.deletePokemon(pokemon.id);
      
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      
      if (onPokemonDeleted) {
        onPokemonDeleted();
      } else {
        onClose();
      }
    } catch (error) {
      setIsDeleting(false);
      setDeleteError(error instanceof Error ? error.message : 'Erro ao excluir Pokémon');
    }
  };

  return (
    <div className="pokemon-detail-overlay">
      <div className="pokemon-detail-modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        
        <div className="pokemon-detail-content">
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
              className="delete-button" 
              onClick={handleDeleteClick}
            >
              Excluir Pokémon
            </button>
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

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h3>Confirmar Exclusão</h3>
            <p>Tem certeza que deseja excluir o Pokémon <strong>{pokemon.name}</strong>?</p>
            <p className="delete-warning">Esta ação não pode ser desfeita!</p>
            
            {deleteError && (
              <div className="error-message">
                {deleteError}
              </div>
            )}
            
            <div className="delete-confirm-actions">
              <button 
                className="cancel-button" 
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button 
                className="confirm-delete-button" 
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonDetail;
