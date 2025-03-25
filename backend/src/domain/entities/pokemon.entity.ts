import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('pokemons')
export class Pokemon {
    
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 50, nullable: false })
    name!: string;

    @Column({ type: 'simple-array',nullable: false })
    types!: string[];

    @Column({ nullable: false, unique: true })
    pokemon_number!: number;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ nullable: true })
    height?: number;
  
    @Column({ nullable: true })
    weight?: number;

    @Column({ length: 255, nullable: true })
    imageUrl?: string;
  
    @Column({ type: 'simple-array', nullable: false })
    moves!: string[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    public isFullyDefined() : boolean {
        return !!(
            this.name &&
            this.name.trim() !== '' &&
            this.types &&
            this.types.length > 0 &&
            this.pokemon_number &&
            this.moves &&
            this.moves.length > 0
        );
    }

    public static create(
        name: string,
        types: string[],
        pokemon_number: number,
        moves: string[],
        options?: {
            description?: string;
            height?: number;
            weight?: number;
            imageUrl?: string;
        }
    ) : Pokemon {
        const pokemon = new Pokemon();
        pokemon.name = name;
        pokemon.types = types;
        pokemon.pokemon_number = pokemon_number;
        pokemon.moves = moves;
        
        if(options) {
            pokemon.description = options.description;
            pokemon.height = options.height;
            pokemon.weight = options.weight;
            pokemon.imageUrl = options.imageUrl;
        }
        return pokemon;
    }
}
