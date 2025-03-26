import { PokemonCreateDto } from "@application/dtos/pokemon-create.dto";
import { Pokemon } from "@domain/entities/pokemon.entity";

export interface PokemonServiceInterface {
    create(pokemonCreateDto: PokemonCreateDto): Promise<Pokemon>;
}
