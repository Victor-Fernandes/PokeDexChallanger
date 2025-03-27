import { PokemonFilter } from '../interfaces/pokemon-filter.interface';
import { PokemonPaginatedResponse } from '../interfaces/pokemon-paginated-response.interface';
import { Pokemon } from '../interfaces/pokemon.interface';

// mock de dados
const MOCK_POKEMONS: Pokemon[] = [
  {
    id: "19eea301-0abf-4db8-bc8c-efc2ca9002cb",
    name: "charmander",
    pokemon_number: 4,
    types: ["fire"],
    description: "Descrição do pokemon: Esperando integração com o Gemini",
    height: 6,
    weight: 85,
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
    moves: ["mega-punch", "fire-punch", "thunder-punch", "scratch", "swords-dance"]
  },
  {
    id: "8fcabb21-529a-4ade-b5bb-98ebfb998bfc",
    name: "raticate",
    pokemon_number: 20,
    types: ["normal"],
    description: "Descrição do pokemon: Esperando integração com o Gemini",
    height: 7,
    weight: 185,
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/20.png",
    moves: ["swords-dance", "cut", "headbutt", "tackle", "body-slam"]
  },
  {
    id: "cafde4df-cdfc-4b4f-b0b5-6d2a9ad459af",
    name: "gastly",
    pokemon_number: 92,
    types: ["ghost", "poison"],
    description: "Descrição do pokemon: Esperando integração com o Gemini",
    height: 13,
    weight: 1,
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png",
    moves: ["fire-punch", "ice-punch", "thunder-punch", "headbutt", "disable"]
  },
  {
    id: "b940fedb-9c40-4208-a274-f1335022ee56",
    name: "haunter",
    pokemon_number: 93,
    types: ["ghost", "poison"],
    description: "Descrição do pokemon: Esperando integração com o Gemini",
    height: 16,
    weight: 1,
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/93.png",
    moves: ["fire-punch", "ice-punch", "thunder-punch", "headbutt", "mega-drain"]
  },
  {
    id: "c0420e4b-1326-463e-9a8b-e8c634eedb88",
    name: "gengar",
    pokemon_number: 94,
    types: ["ghost", "poison"],
    description: "Um Pokémon de tipo fantasma e venenoso",
    height: 15,
    weight: 40,
    imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
    moves: ["shadow-punch", "dream-eater", "hypnosis", "night-shade"]
  }
];

export class PokemonService {
  private apiUrl = 'http://localhost:3000/pokedex';
  
 
  private useMockData = false;

  /**
   * Busca todos os Pokémon com suporte a paginação e filtros
   * 
   * @param filter Objeto com os filtros a serem aplicados
   * @returns Promise com a resposta paginada de Pokémon
   */
  async getAllPokemons(filter: PokemonFilter = {}): Promise<PokemonPaginatedResponse> {
    if (this.useMockData) {
      console.log('Usando dados mockados para desenvolvimento');
      return this.getMockPokemonData(filter);
    }
    
    try {
      let url = this.apiUrl;
      const params = new URLSearchParams();
      
      if (filter.page) {
        params.append('page', filter.page.toString());
      }
      
      if (filter.itemsPerPage) {
        params.append('itemsPerPage', filter.itemsPerPage.toString());
      }
      
      if (filter.name) {
        params.append('name', filter.name);
      }
      
      if (filter.type) {
        params.append('type', filter.type);
      }
      
      const paramsString = params.toString();
      if (paramsString) {
        url += `?${paramsString}`;
      }
      
      console.log('Fazendo requisição para:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar Pokémon: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos da API:', data);
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);

      console.log('Usando dados mockados devido a erro na API');
      return this.getMockPokemonData(filter);
    }
  }
  
  /**
   * Gera dados mockados para desenvolvimento
   * 
   * @param filter Filtros a serem aplicados aos dados mockados
   * @returns Resposta paginada com dados mockados
   */
  private getMockPokemonData(filter: PokemonFilter): PokemonPaginatedResponse {
    const page = filter.page || 1;
    const itemsPerPage = filter.itemsPerPage || 5;
    
    let filteredPokemons = [...MOCK_POKEMONS];
    
    if (filter.name) {
      const nameFilter = filter.name.toLowerCase();
      filteredPokemons = filteredPokemons.filter(pokemon => 
        pokemon.name.toLowerCase().includes(nameFilter)
      );
    }
    
    if (filter.type) {
      const typeFilter = filter.type.toLowerCase();
      filteredPokemons = filteredPokemons.filter(pokemon => 
        pokemon.types.some(type => type.toLowerCase().includes(typeFilter))
      );
    }

    const total = filteredPokemons.length;
    const totalPages = Math.ceil(total / itemsPerPage);
    

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, total);
    
    const paginatedPokemons = filteredPokemons.slice(startIndex, endIndex);
    
    return {
      data: paginatedPokemons,
      page,
      itemsPerPage,
      totalPages,
      total
    };
  }
  
  /**
   * Busca um Pokémon específico pelo ID
   * 
   * @param id ID do Pokémon a ser buscado
   * @returns Promise com os dados do Pokémon
   */
  async getPokemonById(id: string): Promise<Pokemon> {

    if (this.useMockData) {
      console.log('Usando dados mockados para buscar Pokémon por ID');
      const pokemon = MOCK_POKEMONS.find(p => p.id === id);
      if (pokemon) {
        return pokemon;
      }
      throw new Error(`Pokémon com ID ${id} não encontrado`);
    }
    
    try {
      console.log(`Buscando Pokémon com ID: ${id}`);
      const url = `${this.apiUrl}/${id}`;
      console.log('URL da requisição:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar Pokémon: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Dados do Pokémon recebidos:', data);
      
      return data;
    } catch (error) {
      console.error(`Erro ao buscar Pokémon com ID ${id}:`, error);
      
      if (!this.useMockData) {
        console.log('Tentando usar dados mockados como fallback');
        const pokemon = MOCK_POKEMONS.find(p => p.id === id);
        if (pokemon) {
          return pokemon;
        }
      }
      throw error;
    }
  }

  /**
   * Cria um novo Pokémon com base no nome
   * 
   * @param name Nome do Pokémon a ser criado
   * @returns Promise com os dados do Pokémon criado
   */
  async createPokemon(name: string): Promise<Pokemon> {
    if (this.useMockData) {
      console.log('Usando dados mockados para criar Pokémon');
      
      const newPokemon: Pokemon = {
        id: `mock-${Date.now()}`,
        name: name.toLowerCase(),
        pokemon_number: MOCK_POKEMONS.length + 1,
        types: ["normal"],
        description: `Descrição mockada para ${name}`,
        height: 10,
        weight: 100,
        imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png",
        moves: ["tackle", "growl"]
      };
      
      MOCK_POKEMONS.push(newPokemon);
      
      return newPokemon;
    }
    
    try {
      console.log(`Criando Pokémon com nome: ${name}`);
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name: name.toLowerCase() })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro retornado pela API:', errorData);
        throw new Error(`Erro ao criar Pokémon: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Pokémon criado com sucesso:', data);
      
      return data;
    } catch (error) {
      console.error(`Erro ao criar Pokémon com nome ${name}:`, error);
      throw error;
    }
  }
}
