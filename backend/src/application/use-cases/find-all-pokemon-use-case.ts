import { Inject, Injectable } from "@nestjs/common";
import { PokemonCreateResponseDto } from "@application/dtos/pokemon-create.dto";
import { IFindAllPokemonUseCase } from "@domain/ports/interface/pokemon-use-case.interface";
import { IPokemonRepository } from "@domain/ports/interface/pokemon-repository.interface";

@Injectable()
export class FindAllPokemonUseCase implements IFindAllPokemonUseCase {
    constructor(
        @Inject('IPokemonRepository')
        private readonly pokemonRepository: IPokemonRepository
    ) {}

    async execute(): Promise<PokemonCreateResponseDto[]> {
        const pokemons = await this.pokemonRepository.findAll();

        return pokemons.map(pokemon => ({
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.types,
            pokemon_number: pokemon.pokemon_number,
            moves: pokemon.moves,
            description: pokemon.description ?? 'Descrição não disponível',
            height: pokemon.height ?? 0,
            weight: pokemon.weight ?? 0,
            imageUrl: pokemon.imageUrl ?? ''
        }));
    }
}
