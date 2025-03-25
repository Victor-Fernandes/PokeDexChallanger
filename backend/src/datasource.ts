import { DataSource } from "typeorm";
import { Pokemon } from "./domain/entities/pokemon.entity";

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'data/pokedex.sqlite',
    entities: [Pokemon],
    synchronize: false,
    migrations: [__dirname + '/infrastructure/persistence/migrations/**/*{.ts,.js}'],
    migrationsTableName: 'migrations'
});

export default AppDataSource;
