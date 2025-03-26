import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IDeletePokemonUseCase } from "@domain/ports/interface/pokemon-use-case.interface";
import { IPokemonRepository } from "@domain/ports/interface/pokemon-repository.interface";

@Injectable()
export class DeletePokemonUseCase implements IDeletePokemonUseCase {
    constructor(
        @Inject('IPokemonRepository')
        private readonly pokemonRepository: IPokemonRepository
    ) {}

    async execute(id: string): Promise<void> {
        if (!id) {
            throw new NotFoundException('ID de Pokémon não informado');
        }

        const deleted = await this.pokemonRepository.delete(id);

        if (!deleted) {
            throw new NotFoundException(`Pokémon com ID ${id} não encontrado`);
        }
    }
}
