import { PokemonCreateDto } from "@application/dtos/pokemon-create.dto";
import { 
    ICreatePokemonUseCase, 
    IUpdatePokemonUseCase
} from "@domain/ports/interface/pokemon-use-case.interface";
import { IPokemonServiceInterface } from "@domain/ports/interface/pokemon-service-interface";
import { PokemonCreateResponseDto } from "@application/dtos/pokemon-create.dto";
import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PokemonUpdateDto } from "@application/dtos/pokemon-update.dto";
import { PokemonFilterDto, PokemonPaginatedResponseDto } from "@application/dtos/pokemon-findall.dtos";

@ApiTags('Pokedex')
@Controller('pokedex')
export class PokedexController {
    constructor(
        @Inject('ICreatePokemonUseCase')
        private readonly createPokemonUseCase: ICreatePokemonUseCase,
        @Inject('IUpdatePokemonUseCase')
        private readonly updatePokemonUseCase: IUpdatePokemonUseCase,
        @Inject('IPokemonServiceInterface')
        private readonly pokemonService: IPokemonServiceInterface
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
        return this.pokemonService.findOne(id);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos os Pokémons com paginação e filtros' })
    @ApiResponse({ status: 200, description: 'Lista paginada de Pokémons', type: PokemonPaginatedResponseDto })
    @ApiQuery({ name: 'page', required: false, description: 'Número da página (padrão: 1)', type: Number })
    @ApiQuery({ name: 'itemsPerPage', required: false, description: 'Itens por página (padrão: 5)', type: Number })
    @ApiQuery({ name: 'name', required: false, description: 'Filtrar por nome', type: String })
    @ApiQuery({ name: 'type', required: false, description: 'Filtrar por tipo', type: String })
    public async findAll(@Query() filterDto: PokemonFilterDto): Promise<PokemonPaginatedResponseDto> {
        return this.pokemonService.findAll(filterDto);
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
        return this.pokemonService.delete(id);
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