import React, { useState } from 'react';
import { Pokemon } from '../../interfaces/pokemon.interface';
import { PokemonService } from '../../services/pokemon.service';
import './PokemonEditForm.css';

interface PokemonEditFormProps {
  pokemon: Pokemon;
  onPokemonUpdated: () => void;
  onCancel: () => void;
}

const PokemonEditForm: React.FC<PokemonEditFormProps> = ({ 
  pokemon, 
  onPokemonUpdated, 
  onCancel 
}) => {
  const [description, setDescription] = useState(pokemon.description);
  const [height, setHeight] = useState(pokemon.height);
  const [weight, setWeight] = useState(pokemon.weight);
  const [imageUrl, setImageUrl] = useState(pokemon.imageUrl);
  const [moves, setMoves] = useState(pokemon.moves.join(', '));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const pokemonService = new PokemonService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    
    try {
      const movesArray = moves
        .split(',')
        .map(move => move.trim())
        .filter(move => move !== '');
      
      const updatedPokemon = {
        description,
        height,
        weight,
        imageUrl,
        moves: movesArray
      };
      
      await pokemonService.updatePokemon(pokemon.id, updatedPokemon);
      setSuccess(true);
      
      setTimeout(() => {
        onPokemonUpdated();
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Erro ao atualizar Pokémon: ${err.message}`);
      } else {
        setError('Erro ao atualizar Pokémon. Tente novamente.');
      }
      console.error('Erro ao atualizar Pokémon:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pokemon-edit-form-container">
      <div className="pokemon-edit-form-card">
        <h2>Editar Pokémon: {pokemon.name}</h2>
        
        {success ? (
          <div className="success-message">
            <p>Pokémon atualizado com sucesso!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="pokemon-description">Descrição:</label>
              <textarea
                id="pokemon-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição do Pokémon"
                disabled={loading}
                rows={3}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pokemon-height">Altura (dm):</label>
                <input
                  id="pokemon-height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="pokemon-weight">Peso (hg):</label>
                <input
                  id="pokemon-weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="pokemon-image">URL da Imagem:</label>
              <input
                id="pokemon-image"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL da imagem do Pokémon"
                disabled={loading}
              />
              <div className="image-preview">
                <img src={imageUrl} alt={pokemon.name} />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="pokemon-moves">Movimentos (separados por vírgula):</label>
              <textarea
                id="pokemon-moves"
                value={moves}
                onChange={(e) => setMoves(e.target.value)}
                placeholder="Ex: tackle, growl, ember"
                disabled={loading}
                rows={2}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={onCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="submit-button" 
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PokemonEditForm;
