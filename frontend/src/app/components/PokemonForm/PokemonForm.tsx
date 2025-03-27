import React, { useState } from 'react';
import { PokemonService } from '../../services/pokemon.service';
import './PokemonForm.css';

interface PokemonFormProps {
  onPokemonCreated: () => void;
  onCancel: () => void;
}

const PokemonForm: React.FC<PokemonFormProps> = ({ onPokemonCreated, onCancel }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const pokemonService = new PokemonService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('O nome do Pokémon é obrigatório');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await pokemonService.createPokemon(name);
      setSuccess(true);
      setName('');
      setTimeout(() => {
        onPokemonCreated();
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error && err.message && err.message.includes('404')) {
        setError(`Pokémon com nome "${name}" não encontrado na PokeAPI`);
      } else {
        setError('Erro ao criar Pokémon. Tente novamente.');
      }
      console.error('Erro ao criar Pokémon:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pokemon-form-container">
      <div className="pokemon-form-card">
        <h2>Adicionar Novo Pokémon</h2>
        
        {success ? (
          <div className="success-message">
            <p>Pokémon criado com sucesso!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="pokemon-name">Nome do Pokémon:</label>
              <input
                id="pokemon-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: pikachu, charizard, etc."
                disabled={loading}
              />
              <p className="form-help">Digite o nome de um Pokémon existente na PokeAPI</p>
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
                {loading ? 'Criando...' : 'Criar Pokémon'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PokemonForm;
