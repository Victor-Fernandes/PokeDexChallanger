const path = require('path');

module.exports = {
  type: 'sqlite',
  database: path.resolve(__dirname, '..', 'data', 'pokedex.sqlite'),
  entities: [path.resolve(__dirname, 'dist', 'domain', 'entities', '*.entity.js')],
  synchronize: false,
  migrationsRun: false,
  migrations: [path.resolve(__dirname, 'dist', 'infrastructure', 'persistence', 'migrations', '*.js')],
  migrationsTableName: 'migrations',
  cli: {
    migrationsDir: 'src/infrastructure/persistence/migrations'
  }
}
