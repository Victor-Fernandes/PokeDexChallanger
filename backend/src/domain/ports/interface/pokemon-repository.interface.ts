import { Pokemon } from "@domain/entities/pokemon.entity";
import { PokemonFilterDto } from "@application/dtos/pokemon-findall.dtos";

export interface IPokemonRepository {
    save(pokemon: Pokemon): Promise<Pokemon>;
    findOne(id: string): Promise<Pokemon | null>;
    findAll(filterDto: PokemonFilterDto): Promise<PaginatedResult<Pokemon>>;
    delete(id: string): Promise<boolean>;
    update(id: string, pokemon: Partial<Pokemon>): Promise<Pokemon | null>;
    findOneByName(name: string): Promise<Pokemon | null>
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    itemsPerPage: number;
    totalPages: number;
}
