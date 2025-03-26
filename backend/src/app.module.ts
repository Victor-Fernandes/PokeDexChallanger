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
import { CacheModule } from '@nestjs/cache-manager';
import { CacheManagerAdapter } from '@infrastructure/adapters/cache/cache-manager.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 300,
      max: 100,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/pokedex.sqlite',
      entities: [Pokemon],
      synchronize: true,
      migrationsRun: false,
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
    CacheManagerAdapter,
    {
      provide: 'ICacheService',
      useClass: CacheManagerAdapter
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
      useFactory: (httpService: HttpService, pokeApiService: PokemonApiService, pokemonRepository: PokemonRepository, cacheManager: CacheManagerAdapter) => {
        return new CreatePokemonUseCase(pokeApiService, pokemonRepository, cacheManager);
      },
      inject: [HttpService, PokemonApiService, PokemonRepository, CacheManagerAdapter]
    },
    {
      provide: 'IPokemonServiceInterface',
      useFactory: (pokemonRepository: PokemonRepository, cacheManager: CacheManagerAdapter) => {
        return new PokemonService(pokemonRepository, cacheManager);
      },
      inject: [PokemonRepository, CacheManagerAdapter]
    },
    {
      provide: 'IUpdatePokemonUseCase',
      useFactory: (pokemonRepository: PokemonRepository, cacheManager: CacheManagerAdapter) => {
        return new UpdatePokemonUseCase(pokemonRepository, cacheManager);
      },
      inject: [PokemonRepository, CacheManagerAdapter]
    }
  ],
})
export class AppModule {}
