export interface IGeminiService {
    correctPokemon(pokemonName: string): Promise<string | undefined>    
}