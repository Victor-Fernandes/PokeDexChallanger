import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class PokemonCreateDto {
  
    @ApiProperty({
        description: 'The name of the Pokemon',
        example: 'Gengar'
    })
    @IsNotEmpty()
    @IsString()
    name!: string;
}

export class PokemonCreateResponseDto {
    id!: string;
    name!: string;
    types!: string[];
    pokemon_number!: number;
    description!: string;
    moves!: string[];
    height!: number;
    weight!: number;
    imageUrl!: string;
}