export interface IGeminiService {
    correctPokemon(pokemonName: string): Promise<string | undefined>
    createDescription(pokemonName: string): Promise<string | undefined>    
}