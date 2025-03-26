import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PokemonCreateResponseDto } from "@application/dtos/pokemon-create.dto";
import { IFindOnePokemonUseCase } from "@domain/ports/interface/pokemon-use-case.interface";
import { IPokemonRepository } from "@domain/ports/interface/pokemon-repository.interface";

@Injectable()
export class FindOnePokemonUseCase implements IFindOnePokemonUseCase {
    constructor(
        @Inject('IPokemonRepository')
        private readonly pokemonRepository: IPokemonRepository
    ) {}

    async execute(id: string): Promise<PokemonCreateResponseDto> {
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
}
