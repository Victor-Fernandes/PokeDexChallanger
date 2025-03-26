import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IUpdatePokemonUseCase } from "@domain/ports/interface/pokemon-use-case.interface";
import { IPokemonRepository } from "@domain/ports/interface/pokemon-repository.interface";
import { PokemonUpdateDto } from "@application/dtos/pokemon-update.dto";
import { PokemonCreateResponseDto } from "@application/dtos/pokemon-create.dto";

@Injectable()
export class UpdatePokemonUseCase implements IUpdatePokemonUseCase {
    constructor(
        @Inject('IPokemonRepository')
        private readonly pokemonRepository: IPokemonRepository
    ) {}

    async execute(id: string, pokemonUpdateDto: PokemonUpdateDto): Promise<PokemonCreateResponseDto> {
        if (!id) {
            throw new NotFoundException('ID de Pokémon não informado');
        }

        // Garantir que apenas campos permitidos sejam enviados para atualização
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

        // Transformar o resultado para o formato DTO
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
