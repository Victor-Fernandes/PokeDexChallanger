import { Pokemon } from "@domain/entities/pokemon.entity";
import { DataSource } from "typeorm";
import { IPokemonRepository } from "@domain/ports/interface/pokemon-repository.interface";
import { Injectable, Inject, Logger } from "@nestjs/common";
import { AxiosError } from "axios";

@Injectable()
export class PokemonRepository implements IPokemonRepository {
    private readonly logger = new Logger(PokemonRepository.name);
    
    constructor(
        @Inject(DataSource)
        private readonly dataSource: DataSource
    ) {}

    async save(pokemon: Pokemon): Promise<Pokemon> {
        this.logger.debug(`Tentando salvar Pokémon: ${JSON.stringify(pokemon)}`);
        const queryRunner = this.dataSource.createQueryRunner();
        
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        try {
            const tempRepository = queryRunner.manager.getRepository(Pokemon);
            
            // Verificar se a tabela existe
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

    async findOne(id: string): Promise<Pokemon | null> {
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
    
    async findAll(): Promise<Pokemon[]> {
        this.logger.debug('Buscando todos os Pokémons');
        
        try {
            const repository = this.dataSource.getRepository(Pokemon);
            
            const pokemons = await repository.find({
                order: {
                    pokemon_number: 'ASC'
                }
            });
            
            this.logger.debug(`Encontrados ${pokemons.length} Pokémons`);
            return pokemons;
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            this.logger.error(`Erro ao buscar todos os Pokémons: ${axiosError.message}`, axiosError.stack);
            throw error;
        }
    }
}