import { Module } from '@nestjs/common';
import { PokedexController } from './infrastructure/adapters/controllers/pokedex.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './domain/entities/pokemon.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/pokedex.sqlite',
      entities: [Pokemon],
      synchronize: false,
      migrationsRun: true,
      migrations: [__dirname + '/infrastructure/persistence/migrations/**/*{.ts,.js}'],
    }),
    TypeOrmModule.forFeature([Pokemon])
  ],
  controllers: [PokedexController],
  providers: [],
})
export class AppModule {}
