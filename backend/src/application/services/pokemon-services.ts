import { PokemonCreateResponseDto } from "@application/dtos/pokemon-create.dto";
import { PokemonFilterDto, PokemonPaginatedResponseDto } from "@application/dtos/pokemon-findall.dtos";
import { IPokemonRepository } from "@domain/ports/interface/pokemon-repository.interface";
import { IPokemonServiceInterface } from "@domain/ports/interface/pokemon-service-interface";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";


@Injectable()
export class PokemonService implements IPokemonServiceInterface { 
    constructor(
          @Inject('IPokemonRepository')
          private readonly pokemonRepository: IPokemonRepository
      ) {}
  public async findOne(id: string): Promise<PokemonCreateResponseDto> {
          if (!id) {
              throw new NotFoundException('ID de Pokémon não informado');
          }
  
          const pokemon = await this.pokemonRepository.findOne(id);
  
          if (!pokemon) {
              throw new NotFoundException(`Pokémon com ID ${id} não encontrado`);
          }
  
          return {
              id: pokemon.id,
              name: pokemon.name,
              types: pokemon.types,
              pokemon_number: pokemon.pokemon_number,
              moves: pokemon.moves,
              description: pokemon.description ?? 'Descrição não disponível',
              height: pokemon.height ?? 0,
              weight: pokemon.weight ?? 0,
              imageUrl: pokemon.imageUrl ?? ''
          };
      }

  public async findAll(filterDto: PokemonFilterDto = { page: 1, itemsPerPage: 5 }): Promise<PokemonPaginatedResponseDto> {
        const result =  await this.pokemonRepository.findAll(filterDto);

        const pokemonDtos = result.items.map(pokemon => ({
            id: pokemon.id,
            name: pokemon.name,
            pokemon_number: pokemon.pokemon_number,
            types: pokemon.types,
            description: pokemon.description ?? 'Descrição não disponível',
            height: pokemon.height ?? 0,
            weight: pokemon.weight ?? 0,
            imageUrl: pokemon.imageUrl ?? '',
            moves: pokemon.moves
        } as PokemonCreateResponseDto));

        return {
            data: pokemonDtos,
            page: result.page,
            itemsPerPage: result.itemsPerPage,
            totalPages: result.totalPages,
            total: result.total
        };
    }

    public async delete(id: string): Promise<void> {
      if (!id) {
          throw new NotFoundException('ID de Pokémon não informado');
      }

      const deleted = await this.pokemonRepository.delete(id);

      if (!deleted) {
          throw new NotFoundException(`Pokémon com ID ${id} não encontrado`);
      }
  }
}