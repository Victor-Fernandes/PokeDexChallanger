import { PokemonCreateDto } from "@application/dtos/pokemon-create.dto";
import { ICreatePokemonUseCase, IFindAllPokemonUseCase, IFindOnePokemonUseCase } from "@domain/ports/interface/pokemon-use-case.interface";
import { PokemonCreateResponseDto } from "@application/dtos/pokemon-create.dto";
import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Pokedex')
@Controller('pokedex')
export class PokedexController {
    constructor(
        @Inject('ICreatePokemonUseCase')
        private readonly createPokemonUseCase: ICreatePokemonUseCase,
        @Inject('IFindOnePokemonUseCase')
        private readonly findOnePokemonUseCase: IFindOnePokemonUseCase,
        @Inject('IFindAllPokemonUseCase')
        private readonly findAllPokemonUseCase: IFindAllPokemonUseCase
    ) {}
    
    @Post()
    @ApiOperation({ summary: 'Criar um novo Pokémon' })
    @ApiResponse({ status: 201, description: 'Pokémon criado com sucesso', type: PokemonCreateResponseDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 404, description: 'Pokémon não encontrado na PokeAPI' })
    public async createPokemon(
        @Body() pokemonCreateDto: PokemonCreateDto
    ): Promise<PokemonCreateResponseDto> {
        return this.createPokemonUseCase.execute(pokemonCreateDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar um Pokémon pelo ID' })
    @ApiParam({ name: 'id', description: 'ID do Pokémon', type: String })
    @ApiResponse({ status: 200, description: 'Pokémon encontrado', type: PokemonCreateResponseDto })
    @ApiResponse({ status: 404, description: 'Pokémon não encontrado' })
    public async findOne(
        @Param('id') id: string
    ): Promise<PokemonCreateResponseDto> {
        return this.findOnePokemonUseCase.execute(id);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os Pokémons' })
    @ApiResponse({ status: 200, description: 'Lista de Pokémons', type: [PokemonCreateResponseDto] })
    public async findAll(): Promise<PokemonCreateResponseDto[]> {
        return this.findAllPokemonUseCase.execute();
    }
}