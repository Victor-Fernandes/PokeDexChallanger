import { PokemonCreateDto } from "@application/dtos/pokemon-create.dto";
import { PokemonCreateResponseDto } from "@application/dtos/pokemon-create.dto";
import { PokemonUpdateDto } from "@application/dtos/pokemon-update.dto";

export interface ICreatePokemonUseCase {
    execute(pokemonCreateDto: PokemonCreateDto): Promise<PokemonCreateResponseDto>;
}

export interface IUpdatePokemonUseCase {
    execute(id: string, pokemonUpdateDto: PokemonUpdateDto): Promise<PokemonCreateResponseDto>;
}
