import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../interfaces/pokemon.interface';
import { PokemonFilter } from '../../interfaces/pokemon-filter.interface';
import PokemonCard from '../PokemonCard/PokemonCard';
import PokemonDetail from '../PokemonDetail/PokemonDetail';
import PokemonForm from '../PokemonForm/PokemonForm';
import './PokemonList.css';

const PokemonList: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [totalItems, setTotalItems] = useState<number>(0);
  
  const [nameFilter, setNameFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  
  const [error, setError] = useState<string | null>(null);
  
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  
  const pokemonService = useMemo(() => new PokemonService(), []);
  
  const fetchPokemons = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filter: PokemonFilter = {
        page: currentPage,
        itemsPerPage: itemsPerPage,
        name: nameFilter || undefined,
        type: typeFilter || undefined
      };
      
      const response = await pokemonService.getAllPokemons(filter);
      
      setPokemons(response.data);
      setTotalPages(response.totalPages);
      setTotalItems(response.total);
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
      setError('Não foi possível carregar os Pokémon. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, nameFilter, typeFilter, pokemonService]);
  
  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]); 
  
  const handleApplyFilters = () => {
    setCurrentPage(1); 
    fetchPokemons();
  };

  const handleClearFilters = () => {
    setNameFilter('');
    setTypeFilter('');
    setCurrentPage(1);
    setTimeout(() => {
      fetchPokemons();
    }, 0);
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePokemonClick = async (pokemon: Pokemon) => {
    try {
      const detailedPokemon = await pokemonService.getPokemonById(pokemon.id);
      setSelectedPokemon(detailedPokemon);
    } catch (error) {
      console.error('Erro ao buscar detalhes do Pokémon:', error);
      setSelectedPokemon(pokemon);
    }
  };

  const handleCloseDetail = () => {
    setSelectedPokemon(null);
  };
  
  const handleShowCreateForm = () => {
    setShowCreateForm(true);
  };
  
  const handleCloseCreateForm = () => {
    setShowCreateForm(false);
  };
  
  const handlePokemonCreated = () => {
    fetchPokemons();
    setShowCreateForm(false);
  };

  return (
    <div className="pokemon-list-container">
      <div className="list-header">
        <h1>Lista de Pokémon</h1>
        <button 
          className="create-pokemon-button" 
          onClick={handleShowCreateForm}
        >
          Adicionar Pokémon
        </button>
      </div>
      
      {}
      <div className="filters-section">
        <div className="filter-inputs">
          <div className="filter-group">
            <label htmlFor="name-filter">Nome:</label>
            <input
              id="name-filter"
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Filtrar por nome"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="type-filter">Tipo:</label>
            <input
              id="type-filter"
              type="text"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              placeholder="Filtrar por tipo"
            />
          </div>
        </div>
        <div className="filter-buttons">
          <button onClick={handleApplyFilters} className="apply-filter-button">
            Aplicar Filtros
          </button>
          <button onClick={handleClearFilters} className="clear-filter-button">
            Limpar Filtros
          </button>
        </div>
      </div>
      
      {}
      {error && <div className="error-message">{error}</div>}
      
      {}
      {loading && <div className="loading">Carregando Pokémon...</div>}
      
      {}
      {!loading && pokemons.length === 0 ? (
        <div className="no-results">Nenhum Pokémon encontrado.</div>
      ) : (
        <div className="pokemon-grid">
          {pokemons.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onClick={() => handlePokemonClick(pokemon)}
            />
          ))}
        </div>
      )}
      
      {}
      {!loading && pokemons.length > 0 && (
        <div className="pagination-controls">
          <div className="pagination-info">
            <span>
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
              {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems} Pokémon
            </span>
            <div className="items-per-page">
              <label htmlFor="items-per-page">Itens por página:</label>
              <select
                id="items-per-page"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
          <div className="pagination-buttons">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Anterior
            </button>
            <span className="page-indicator">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
      
      {}
      <PokemonDetail 
        pokemon={selectedPokemon} 
        onClose={handleCloseDetail} 
      />
      
      {showCreateForm && (
        <PokemonForm 
          onPokemonCreated={handlePokemonCreated}
          onCancel={handleCloseCreateForm}
        />
      )}
    </div>
  );
};

export default PokemonList;
