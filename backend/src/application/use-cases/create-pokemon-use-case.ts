import { ICreatePokemonUseCase } from "@domain/ports/interface/pokemon-use-case.interface";
import { PokemonCreateDto, PokemonCreateResponseDto } from "@application/dtos/pokemon-create.dto";
import { BadRequestException, Inject} from "@nestjs/common";
import { IPokeApiService } from "@domain/ports/interface/pokemon-external-services.interface";
import { PokemonApiResponseDto } from "@application/dtos/poke-api-response.dto";
import { IPokemonRepository } from "@domain/ports/interface/pokemon-repository.interface";
import { Pokemon } from "@domain/entities/pokemon.entity";

export class CreatePokemonUseCase implements ICreatePokemonUseCase {

    constructor(
        @Inject('IPokeApiService') 
        private readonly pokeApiService: IPokeApiService,
        @Inject('IPokemonRepository')
        private readonly pokemonRepository: IPokemonRepository
    ) {}

    async execute(pokemonCreateDto: PokemonCreateDto): Promise<PokemonCreateResponseDto> {

        if(!pokemonCreateDto.name) {
            throw new BadRequestException('Dados inválidos');
        }

        const pokemonData = await this.pokeApiService.getPokemonByName(pokemonCreateDto.name);

        await this.existsPokemon(pokemonData.name);
        const types: string[] = this.mapPokemonTypes(pokemonData);
        
        const moves: string[] = this.mapPokemonMoves(pokemonData);

        const pokemon = Pokemon.create(
            pokemonData.name,
            types,
            pokemonData.id,
            moves,
            {
                height: pokemonData.height,
                weight: pokemonData.weight,
                imageUrl: pokemonData.sprites?.other?.['official-artwork']?.front_default || pokemonData.sprites?.front_default || '',
                description: 'Descrição do pokemon: Esperando integração com o Gemini'
            }
        );

        const savedPokemon = await this.pokemonRepository.save(pokemon);
        
        return {
            id: savedPokemon.id,
            name: savedPokemon.name,
            types: savedPokemon.types,
            pokemon_number: savedPokemon.pokemon_number,
            moves: savedPokemon.moves,
            description: savedPokemon.description ?? 'Descrição do pokemon: Esperando integração com o Gemini',
            height: savedPokemon.height ?? 0,
            weight: savedPokemon.weight ?? 0,
            imageUrl: savedPokemon.imageUrl ?? ''
        };
    }

    private mapPokemonTypes(pokemonData: PokemonApiResponseDto): string[] {
        if (!pokemonData.types || !Array.isArray(pokemonData.types) || pokemonData.types.length === 0) {
            return ['no-type'];
        }
        return pokemonData.types.map((type: { type: { name: string } }) => type.type.name);
    }

    private mapPokemonMoves(pokemonData: PokemonApiResponseDto): string[] {
        if (!pokemonData.moves || !Array.isArray(pokemonData.moves) || pokemonData.moves.length === 0) {
            return ['no-move'];
        }
        return pokemonData.moves
            .slice(0, 5)
            .map((move: { move: { name: string } }) => move.move.name);
    }

    private async existsPokemon(name: string): Promise<string | void> {
        const pokemon = await this.pokemonRepository.findOneByName(name);
        
        if (pokemon) throw new BadRequestException('Pokemon já existe na base de dados!');
    }
} 
