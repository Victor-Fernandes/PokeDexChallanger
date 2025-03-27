import { Inject, Injectable, NotFoundException, Logger } from "@nestjs/common";
import { IUpdatePokemonUseCase } from "@domain/ports/interface/pokemon-use-case.interface";
import { IPokemonRepository } from "@domain/ports/interface/pokemon-repository.interface";
import { PokemonUpdateDto } from "@application/dtos/pokemon-update.dto";
import { PokemonCreateResponseDto } from "@application/dtos/pokemon-create.dto";
import { ICacheService } from "@domain/ports/interface/cache-service.interface";

@Injectable()
export class UpdatePokemonUseCase implements IUpdatePokemonUseCase {
    private readonly logger = new Logger(UpdatePokemonUseCase.name)
    constructor(
        @Inject('IPokemonRepository')
        private readonly pokemonRepository: IPokemonRepository,
        @Inject('ICacheService')
        private readonly cacheService: ICacheService
    ) {}

    async execute(id: string, pokemonUpdateDto: PokemonUpdateDto): Promise<PokemonCreateResponseDto> {
        if (!id) {
            throw new NotFoundException('ID de Pokémon não informado');
        }

        const updatedPokemon = await this.pokemonRepository.update(id, {
            description: pokemonUpdateDto.description,
            height: pokemonUpdateDto.height,
            weight: pokemonUpdateDto.weight,
            imageUrl: pokemonUpdateDto.imageUrl,
            moves: pokemonUpdateDto.moves
        });

        if (!updatedPokemon) {
            throw new NotFoundException(`Pokémon com ID ${id} não encontrado`);
        }

         try {
            await this.cacheService.reset();
            this.logger.log('Cache invalidado após atualização de Pokémon');
        } catch (error) {
            this.logger.error('Erro ao invalidar cache', error);
        }

        return {
            id: updatedPokemon.id,
            name: updatedPokemon.name,
            types: updatedPokemon.types,
            pokemon_number: updatedPokemon.pokemon_number,
            moves: updatedPokemon.moves,
            description: updatedPokemon.description ?? 'Descrição não disponível',
            height: updatedPokemon.height ?? 0,
            weight: updatedPokemon.weight ?? 0,
            imageUrl: updatedPokemon.imageUrl ?? ''
        };
    }
}
