import { Module } from '@nestjs/common';
import { PokedexController } from './infrastructure/adapters/controllers/pokedex.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './domain/entities/pokemon.entity';
import { CreatePokemonUseCase } from '@application/use-cases/create-pokemon-use-case';
import { FindOnePokemonUseCase } from '@application/use-cases/find-one-pokemon-use-case';
import { FindAllPokemonUseCase } from '@application/use-cases/find-all-pokemon-use-case';
import { HttpModule, HttpService } from '@nestjs/axios';
import { PokemonApiService } from '@infrastructure/adapters/external/pokemon-api.service';
import { ConfigModule } from '@nestjs/config';
import { PokemonRepository } from '@infrastructure/persistence/persistence/pokemon.repository';

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
      useFactory: (httpService: HttpService, pokeApiService: PokemonApiService, pokemonRepository: PokemonRepository) => {
        return new CreatePokemonUseCase(pokeApiService, pokemonRepository);
      },
      inject: [HttpService, PokemonApiService, PokemonRepository]
    },
    {
      provide: 'IFindOnePokemonUseCase',
      useFactory: (pokemonRepository: PokemonRepository) => {
        return new FindOnePokemonUseCase(pokemonRepository);
      },
      inject: [PokemonRepository]
    },
    {
      provide: 'IFindAllPokemonUseCase',
      useFactory: (pokemonRepository: PokemonRepository) => {
        return new FindAllPokemonUseCase(pokemonRepository);
      },
      inject: [PokemonRepository]
    }
  ],
})
export class AppModule {}
