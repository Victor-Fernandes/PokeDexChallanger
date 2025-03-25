import { Controller, Post } from "@nestjs/common";

@Controller('pokedex')
export class PokedexController {
    
    @Post()
    public async createPokemon(): Promise<string> {
        return 'create pokemon'
    }
}