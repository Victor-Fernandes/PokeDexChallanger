import { Pokemon } from "@domain/entities/pokemon.entity";

export interface IPokemonRepository {
    save(pokemon: Pokemon): Promise<Pokemon>;
    findOne(id: string): Promise<Pokemon | null>;
    findAll(): Promise<Pokemon[]>;
}
