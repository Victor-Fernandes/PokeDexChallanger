import { PokemonCreateResponseDto } from "@application/dtos/pokemon-create.dto";
import { PokemonFilterDto } from "@application/dtos/pokemon-findall.dtos";
import { PokemonPaginatedResponseDto } from "@application/dtos/pokemon-findall.dtos";

export interface IPokemonServiceInterface {
    findOne(id: string): Promise<PokemonCreateResponseDto>;
    findAll(pokemonFilterDto: PokemonFilterDto): Promise<PokemonPaginatedResponseDto>;
    delete(id: string): Promise<void>;
}

