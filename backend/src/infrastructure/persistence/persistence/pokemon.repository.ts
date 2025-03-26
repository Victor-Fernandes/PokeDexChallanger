import { Pokemon } from "@domain/entities/pokemon.entity";
import { DataSource } from "typeorm";
import { IPokemonRepository, PaginatedResult } from "@domain/ports/interface/pokemon-repository.interface";
import { Injectable, Inject, Logger } from "@nestjs/common";
import { AxiosError } from "axios";
import { PokemonFilterDto } from "@application/dtos/pokemon-findall.dtos";

@Injectable()
export class PokemonRepository implements IPokemonRepository {
    private readonly logger = new Logger(PokemonRepository.name);
    
    constructor(
        @Inject(DataSource)
        private readonly dataSource: DataSource
    ) {}

    public async save(pokemon: Pokemon): Promise<Pokemon> {
        this.logger.debug(`Tentando salvar Pokémon: ${JSON.stringify(pokemon)}`);
        const queryRunner = this.dataSource.createQueryRunner();
        
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const tempRepository = queryRunner.manager.getRepository(Pokemon);
            
            const tableExists = await queryRunner.hasTable('pokemons');
            this.logger.debug(`Tabela 'pokemons' existe? ${tableExists}`);
            
            if (!tableExists) {
                this.logger.error('A tabela pokemons não existe no banco de dados!');
                throw new Error('Tabela pokemons não encontrada');
            }

            const savedPokemon = await tempRepository.save(pokemon);
            this.logger.debug(`Pokémon salvo com sucesso: ${JSON.stringify(savedPokemon)}`);

            await queryRunner.commitTransaction();
            
            return savedPokemon;
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            this.logger.error(`Erro ao salvar Pokémon: ${axiosError.message}`, axiosError.stack);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    public async findOne(id: string): Promise<Pokemon | null> {
        this.logger.debug(`Buscando Pokémon com ID: ${id}`);
        
        try {
            const repository = this.dataSource.getRepository(Pokemon);
            
            const pokemon = await repository.findOne({ 
                where: { id } 
            });
            
            if (!pokemon) {
                this.logger.debug(`Pokémon com ID ${id} não encontrado`);
                return null;
            }
            
            this.logger.debug(`Pokémon encontrado: ${JSON.stringify(pokemon)}`);
            return pokemon;
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            this.logger.error(`Erro ao buscar Pokémon: ${axiosError.message}`, axiosError.stack);
            throw error;
        }
    }
    
    public async findAll(filterDto: PokemonFilterDto): Promise<PaginatedResult<Pokemon>> {

        const { page = 1, itemsPerPage = 5, name, type } = filterDto

        this.logger.debug(`Buscando Pokémons com filtros: page=${page}, itemsPerPage=${itemsPerPage}, name=${name || 'todos'}, type=${type || 'todos'}`);
        
        try {
            const repository = this.dataSource.getRepository(Pokemon);
            
            const queryBuilder = repository.createQueryBuilder('pokemon');

            if (name) {
                queryBuilder.andWhere('pokemon.name LIKE :name', { 
                    name: `%${name}%` 
                });
            }

            if (type) {
                queryBuilder.andWhere('pokemon.types LIKE :type', { 
                    type: `%${type}%` 
                });
            }
 
            const total = await queryBuilder.getCount();
            
            const totalPages = Math.ceil(total / itemsPerPage);
            
            queryBuilder
                .orderBy('pokemon.pokemon_number', 'ASC')
                .skip((page - 1) * itemsPerPage)
                .take(itemsPerPage);
            
            const pokemons = await queryBuilder.getMany();
            
            this.logger.debug(`Encontrados ${pokemons.length} Pokémons (total de ${total})`);
            
            return {
                items: pokemons,
                total,
                page,
                itemsPerPage,
                totalPages
            }
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            this.logger.error(`Erro ao buscar todos os Pokémons: ${axiosError.message}`, axiosError.stack);
            throw error;
        }
    }
    
    public async delete(id: string): Promise<boolean> {
        this.logger.debug(`Tentando deletar Pokémon com ID: ${id}`);
        
        const queryRunner = this.dataSource.createQueryRunner();
        
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const tempRepository = queryRunner.manager.getRepository(Pokemon);
            
            const pokemon = await tempRepository.findOne({ where: { id } });
            
            if (!pokemon) {
                this.logger.debug(`Pokémon com ID ${id} não encontrado para deleção`);
                await queryRunner.rollbackTransaction();
                return false;
            }
            
            await tempRepository.remove(pokemon);
            this.logger.debug(`Pokémon com ID ${id} deletado com sucesso`);
            
            await queryRunner.commitTransaction();
            return true;
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            this.logger.error(`Erro ao deletar Pokémon: ${axiosError.message}`, axiosError.stack);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
    
    public async update(id: string, pokemonData: Partial<Pokemon>): Promise<Pokemon | null> {
        this.logger.debug(`Tentando atualizar Pokémon com ID: ${id}`);
        this.logger.debug(`Dados para atualização: ${JSON.stringify(pokemonData)}`);
        
        const queryRunner = this.dataSource.createQueryRunner();
        
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const tempRepository = queryRunner.manager.getRepository(Pokemon);
            
            const pokemon = await tempRepository.findOne({ where: { id } });
            
            if (!pokemon) {
                this.logger.debug(`Pokémon com ID ${id} não encontrado para atualização`);
                await queryRunner.rollbackTransaction();
                return null;
            }
            
            const allowedUpdates: Partial<Pokemon> = {
                description: pokemonData.description,
                height: pokemonData.height,
                weight: pokemonData.weight,
                imageUrl: pokemonData.imageUrl,
                moves: pokemonData.moves
            };
        
            Object.keys(allowedUpdates).forEach(key => {
                const typedKey = key as keyof typeof allowedUpdates;
                if (allowedUpdates[typedKey] === undefined) {
                    delete allowedUpdates[typedKey];
                }
            });
            
            const updatedPokemon = await tempRepository.save({
                ...pokemon,
                ...allowedUpdates
            });
            
            this.logger.debug(`Pokémon com ID ${id} atualizado com sucesso`);
            
            await queryRunner.commitTransaction();
            return updatedPokemon;
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            this.logger.error(`Erro ao atualizar Pokémon: ${axiosError.message}`, axiosError.stack);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    public async findOneByName(name: string): Promise<Pokemon | null> {
        this.logger.debug(`Buscando Pokémon com ID: ${name}`);
        
        try {
            const repository = this.dataSource.getRepository(Pokemon);
            
            const pokemon = await repository.findOne({ 
                where: { name } 
            });
            
            if (!pokemon) {
                this.logger.debug(`Pokémon com ID ${name} não encontrado`);
                return null;
            }
            
            this.logger.debug(`Pokémon encontrado: ${JSON.stringify(pokemon)}`);
            return pokemon;
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            this.logger.error(`Erro ao buscar Pokémon: ${axiosError.message}`, axiosError.stack);
            throw error;
        }
    }
}