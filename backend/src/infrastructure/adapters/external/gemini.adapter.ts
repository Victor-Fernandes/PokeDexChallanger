import { IGeminiService } from "@domain/ports/interface/gemini-service-interface";
import { GoogleGenAI } from "@google/genai";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class GeminiAdapter implements IGeminiService {
    
    private readonly genAi: GoogleGenAI;
    private readonly logger = new Logger(GeminiAdapter.name);
    private readonly model: string = "gemini-1.5-flash";

    constructor(
        private readonly configService: ConfigService
    ) {
        const apiKey = this.configService.getOrThrow<string>('GEMINI_API_KEY')
        this.genAi = new GoogleGenAI({ apiKey }); 
    }

    public async correctPokemon(pokemonName: string): Promise<string | undefined> {
        this.logger.debug(`Verificando se o nome do Pokémon está correto: ${pokemonName}`);
        
        try {
            const prompt = `
            Você é um especialista em Pokémon. Analise o nome "${pokemonName}" e determine:
            
            1. Se é um nome válido de um Pokémon existente: responda apenas com o nome exatamente como deveria ser escrito, com a primeira letra maiúscula.
            2. Se não for um nome válido: corrija para o nome do Pokémon mais próximo ou similar.
            3. Se não houver nenhum Pokémon parecido: responda com "Desconhecido".
            
            Responda APENAS com o nome corrigido, sem explicações.
            `;

            const result = await this.genAi.models.generateContent({
                model: this.model,
                contents: prompt,
            });
            const response = result.text;
            
            this.logger.debug(`Resposta do Gemini: "${response}" para entrada: "${pokemonName}"`);
            
            return response === "Desconhecido" ? pokemonName : response;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            this.logger.error(`Erro ao verificar nome do Pokémon com Gemini: ${errorMessage}`);

            return pokemonName;
        }
    }

    public async createDescription(pokemonName: string): Promise<string | undefined> {
        this.logger.debug(`criando a descricao para o pokemon: ${pokemonName}`);
        
        try {
            const prompt = `
            Você é um especialista em Pokémon. Crie uma descrição concisa e interessante para o Pokémon "${pokemonName}".
            
            A descrição deve:
            1. Ter apenas uma linha (máximo 150 caracteres)
            2. Mencionar características marcantes do Pokémon
            3. Ser informativa e precisa
            
            Responda APENAS com a descrição, sem explicações adicionais.
            `

            const result = await this.genAi.models.generateContent({
                model: this.model,
                contents: prompt,
            });
            const response = result.text;
            
            this.logger.debug(`Resposta do Gemini: "${response}" para entrada: "${pokemonName}"`);
            
            return response;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            this.logger.error(`Erro ao verificar nome do Pokémon com Gemini: ${errorMessage}`);

            return pokemonName;
        }
    }
}

export default GeminiAdapter;
