import { Module } from '@nestjs/common';
import { PokedexController } from './infrastructure/adapters/controllers/pokedex.controller';

@Module({
  imports: [],
  controllers: [PokedexController],
  providers: [],
})
export class AppModule {}
