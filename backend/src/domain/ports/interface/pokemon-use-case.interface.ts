import { PokemonCreateDto } from "@application/dtos/pokemon-create.dto";
import { PokemonCreateResponseDto } from "@application/dtos/pokemon-create.dto";

export interface ICreatePokemonUseCase {
    execute(pokemonCreateDto: PokemonCreateDto): Promise<PokemonCreateResponseDto>;
}

export interface IFindOnePokemonUseCase {
    execute(id: string): Promise<PokemonCreateResponseDto>;
}

export interface IFindAllPokemonUseCase {
    execute(): Promise<PokemonCreateResponseDto[]>;
}
