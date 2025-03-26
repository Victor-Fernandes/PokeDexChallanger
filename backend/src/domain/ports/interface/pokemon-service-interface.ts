import { PokemonCreateResponseDto } from "@application/dtos/pokemon-create.dto";

export interface IPokemonServiceInterface {
    findOne(id: string): Promise<PokemonCreateResponseDto>;
    findAll(): Promise<PokemonCreateResponseDto[]>;
    delete(id: string): Promise<void>;
}
