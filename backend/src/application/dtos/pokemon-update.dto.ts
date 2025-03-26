import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class PokemonUpdateDto {
    @ApiProperty({
        description: 'Descrição do Pokémon',
        example: 'Um Pokémon de tipo fantasma e venenoso',
        required: false
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'Altura do Pokémon',
        example: 15,
        required: false
    })
    @IsOptional()
    @IsNumber()
    height?: number;
  
    @ApiProperty({
        description: 'Peso do Pokémon',
        example: 40,
        required: false
    })
    @IsOptional()
    @IsNumber()
    weight?: number;

    @ApiProperty({
        description: 'URL da imagem do Pokémon',
        example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',
        required: false
    })
    @IsOptional()
    @IsString()
    imageUrl?: string;
  
    @ApiProperty({
        description: 'Movimentos do Pokémon',
        example: ['shadow-punch', 'dream-eater', 'hypnosis', 'lick', 'night-shade'],
        required: false
    })
    @IsOptional()
    @IsArray()
    moves?: string[];
}
