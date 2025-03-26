import { PokemonCreateResponseDto } from "./pokemon-create.dto";
import { IsOptional, IsString, IsInt, Min, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class PokemonPaginatedResponseDto {
  data!: PokemonCreateResponseDto[];
  page!: number;
  itemsPerPage!: number;
  totalPages!: number;
  total!: number;
}

export class PokemonFilterDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page = 1;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  itemsPerPage = 5;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;
}