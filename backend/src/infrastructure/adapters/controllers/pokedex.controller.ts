import { Body, Controller, Post } from "@nestjs/common";

@Controller('pokedex')
export class PokedexController {

    constructor() {}
    
    @Post()
    public async createPokemon() {
        return 'create pokemon'
    }
}