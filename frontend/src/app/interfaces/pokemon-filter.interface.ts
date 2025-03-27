/**
 * Interface que representa os filtros para busca de Pokémon
 * Esta interface segue o formato esperado pelo backend para filtrar Pokémon
 */
export interface PokemonFilter {
  page?: number;         // Página atual (padrão: 1)
  itemsPerPage?: number; // Itens por página (padrão: 5)
  name?: string;         // Filtro por nome do Pokémon
  type?: string;         // Filtro por tipo do Pokémon
}
