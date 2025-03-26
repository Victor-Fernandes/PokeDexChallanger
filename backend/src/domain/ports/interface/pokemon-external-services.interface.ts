import { PokemonApiResponseDto } from "@application/dtos/poke-api-response.dto";


export interface IPokeApiService {
    getPokemonByName(name: string): Promise<PokemonApiResponseDto>;
}
