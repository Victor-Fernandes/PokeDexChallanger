import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePokemonTable1742910618704 implements MigrationInterface {
    name = 'CreatePokemonTable1742910618704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pokemons" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(50) NOT NULL, "types" text NOT NULL, "pokemon_number" integer NOT NULL, "description" text, "height" integer, "weight" integer, "imageUrl" varchar(255), "moves" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_e92141b6198476df3c1b1a23144" UNIQUE ("pokemon_number"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pokemons"`);
    }

}
