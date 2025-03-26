export class PokemonApiResponseDto {
    id!: number;
    name!: string;
    height!: number;
    weight!: number;
    
    types!: Array<{
      type: {
        name: string;
      }
    }>;
    
    moves!: Array<{
      move: {
        name: string;
      }
    }>;
    
    sprites!: {
      front_default: string;
      other: {
        'official-artwork': {
          front_default: string;
        }
      }
    };
}