import { Pokemon } from './pokemon.interface';

export interface PokemonPaginatedResponse {
  data: Pokemon[];       
  page: number;          
  itemsPerPage: number;  
  totalPages: number;    
  total: number;        
}
