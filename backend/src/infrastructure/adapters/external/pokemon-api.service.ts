import { Injectable } from "@nestjs/common/decorators";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { IPokeApiService } from "@domain/ports/interface/pokemon-external-services.interface";
import { NotFoundException } from "@nestjs/common";
import { PokemonApiResponseDto } from "@application/dtos/poke-api-response.dto";
import { AxiosError } from "axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PokemonApiService implements IPokeApiService {

    private readonly baseUrl: string;
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService
    ) {
        this.baseUrl = this.configService.getOrThrow<string>('POKE_API_BASE_URL'); 
    }

    public async getPokemonByName(name: string): Promise<PokemonApiResponseDto> {

        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.baseUrl}/pokemon/${name}`)
            );

            return response.data;
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.status === 404) {
                throw new NotFoundException(`Pokémon com nome ${name} não encontrado`);
            }
            throw new Error(`Erro ao buscar dados do Pokémon: ${axiosError.message}`);
        }
    }
}