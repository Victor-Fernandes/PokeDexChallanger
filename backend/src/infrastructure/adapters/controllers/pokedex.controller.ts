import { PokemonCreateDto } from "@application/dtos/pokemon-create.dto";
import { 
    ICreatePokemonUseCase, 
    IDeletePokemonUseCase, 
    IFindAllPokemonUseCase, 
    IFindOnePokemonUseCase,
    IUpdatePokemonUseCase
} from "@domain/ports/interface/pokemon-use-case.interface";
import { PokemonCreateResponseDto } from "@application/dtos/pokemon-create.dto";
import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Patch, Post } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PokemonUpdateDto } from "@application/dtos/pokemon-update.dto";

@ApiTags('Pokedex')
@Controller('pokedex')
export class PokedexController {
    constructor(
        @Inject('ICreatePokemonUseCase')
        private readonly createPokemonUseCase: ICreatePokemonUseCase,
        @Inject('IFindOnePokemonUseCase')
        private readonly findOnePokemonUseCase: IFindOnePokemonUseCase,
        @Inject('IFindAllPokemonUseCase')
        private readonly findAllPokemonUseCase: IFindAllPokemonUseCase,
        @Inject('IDeletePokemonUseCase')
        private readonly deletePokemonUseCase: IDeletePokemonUseCase,
        @Inject('IUpdatePokemonUseCase')
        private readonly updatePokemonUseCase: IUpdatePokemonUseCase
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

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Deletar um Pokémon pelo ID' })
    @ApiParam({ name: 'id', description: 'ID do Pokémon', type: String })
    @ApiResponse({ status: 204, description: 'Pokémon deletado com sucesso' })
    @ApiResponse({ status: 404, description: 'Pokémon não encontrado' })
    public async delete(
        @Param('id') id: string
    ): Promise<void> {
        return this.deletePokemonUseCase.execute(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar um Pokémon pelo ID' })
    @ApiParam({ name: 'id', description: 'ID do Pokémon', type: String })
    @ApiResponse({ status: 200, description: 'Pokémon atualizado com sucesso', type: PokemonCreateResponseDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos' })
    @ApiResponse({ status: 404, description: 'Pokémon não encontrado' })
    public async update(
        @Param('id') id: string,
        @Body() pokemonUpdateDto: PokemonUpdateDto
    ): Promise<PokemonCreateResponseDto> {
        return this.updatePokemonUseCase.execute(id, pokemonUpdateDto);
    }
}