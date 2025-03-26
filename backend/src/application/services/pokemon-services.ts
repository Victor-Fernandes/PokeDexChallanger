import { PokemonCreateResponseDto } from "@application/dtos/pokemon-create.dto";
import { PokemonFilterDto, PokemonPaginatedResponseDto } from "@application/dtos/pokemon-findall.dtos";
import { IPokemonRepository } from "@domain/ports/interface/pokemon-repository.interface";
import { IPokemonServiceInterface } from "@domain/ports/interface/pokemon-service-interface";
import { ICacheService } from "@domain/ports/interface/cache-service.interface";
import { Inject, Injectable, NotFoundException, Logger } from "@nestjs/common";

@Injectable()
export class PokemonService implements IPokemonServiceInterface { 

    private readonly logger = new Logger(PokemonService.name);

    constructor(
          @Inject('IPokemonRepository')
          private readonly pokemonRepository: IPokemonRepository,
          @Inject('ICacheService')
          private readonly cacheManager: ICacheService
      ) {
      }

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

  public async findAll(filterDto: PokemonFilterDto): Promise<PokemonPaginatedResponseDto> {
    const cacheKey = `pokemons_${filterDto.page || 1}_${filterDto.itemsPerPage || 5}_${filterDto.name || ''}_${filterDto.type || ''}`;
    this.logger.log(`Buscando dados do cache para a chave: ${cacheKey}`);

    try {
        const cachedData = await this.cacheManager.get<PokemonPaginatedResponseDto>(cacheKey);
        
        if (cachedData) {
          this.logger.log(`Retornando dados do cache para a chave: ${cacheKey}`);
          return cachedData;
        }
        
        this.logger.log(`Cache miss para a chave: ${cacheKey}, buscando dados do repositório`);
        
        const result = await this.pokemonRepository.findAll(filterDto);
        
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
        
        const responseData = {
          data: pokemonDtos,
          page: result.page,
          itemsPerPage: result.itemsPerPage,
          totalPages: result.totalPages,
          total: result.total
        };
 
        await this.cacheManager.set(cacheKey, responseData, 300);
        
        this.logger.log(`Dados armazenados no cache para a chave: ${cacheKey}`);
        
        return responseData;
      } catch (error) {
        this.logger.error(`Erro ao buscar Pokémons: ${(error as Error).message}`, (error as Error).stack);
        throw error;
      }
}

public async delete(id: string): Promise<void> {
    if (!id) {
        throw new NotFoundException('ID de Pokémon não informado');
    }
    const deleted = await this.pokemonRepository.delete(id);
    if (!deleted) {
        throw new NotFoundException(`Pokémon com ID ${id} não encontrado`);
    }
    await this.invalidateCache();
}

private async invalidateCache(): Promise<void> {
    try {
        await this.cacheManager.reset();
        this.logger.log('Cache invalidado após modificação de dados');
    } catch (error) {
        this.logger.error('Erro ao invalidar cache', error);
    }
}
}