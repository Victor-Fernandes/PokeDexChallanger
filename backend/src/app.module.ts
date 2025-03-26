import { Module } from '@nestjs/common';
import { PokedexController } from './infrastructure/adapters/controllers/pokedex.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './domain/entities/pokemon.entity';
import { CreatePokemonUseCase } from '@application/use-cases/create-pokemon-use-case';
import { UpdatePokemonUseCase } from '@application/use-cases/update-pokemon-use-case';
import { HttpModule, HttpService } from '@nestjs/axios';
import { PokemonApiService } from '@infrastructure/adapters/external/pokemon-api.service';
import { ConfigModule } from '@nestjs/config';
import { PokemonRepository } from '@infrastructure/persistence/persistence/pokemon.repository';
import { PokemonService } from '@application/services/pokemon-services';
import { GeminiAdapter } from '@infrastructure/adapters/external/gemini.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/pokedex.sqlite',
      entities: [Pokemon],
      synchronize: true, // Habilitado temporariamente para criar a tabela
      migrationsRun: false, // Desabilitado temporariamente para evitar conflitos
      migrations: [__dirname + '/../infrastructure/persistence/migrations/**/*.{ts,js}'],
      migrationsTableName: 'migrations',
    }),
    TypeOrmModule.forFeature([Pokemon]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    })
  ],
  controllers: [PokedexController],
  providers: [
    PokemonApiService,
    PokemonRepository,
    GeminiAdapter,
    {
      provide: 'IGeminiService',
      useClass: GeminiAdapter,
    },
    {
      provide: 'IPokemonRepository',
      useClass: PokemonRepository
    },
    {
      provide: 'IPokeApiService',
      useClass: PokemonApiService
    },
    {
      provide: 'ICreatePokemonUseCase',
      useFactory: (pokeApiService: PokemonApiService, pokemonRepository: PokemonRepository, geminiService: GeminiAdapter) => {
        return new CreatePokemonUseCase(pokeApiService, pokemonRepository, geminiService);
      },
      inject: [PokemonApiService, PokemonRepository, GeminiAdapter]
    },
    {
      provide: 'IPokemonServiceInterface',
      useFactory: (pokemonRepository: PokemonRepository) => {
        return new PokemonService(pokemonRepository);
      },
      inject: [PokemonRepository]
    },
    {
      provide: 'IUpdatePokemonUseCase',
      useFactory: (pokemonRepository: PokemonRepository) => {
        return new UpdatePokemonUseCase(pokemonRepository);
      },
      inject: [PokemonRepository]
    }
  ],
})
export class AppModule {}
