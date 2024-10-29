import {
  IsArray,
  IsInt,
  IsPositive,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePokemonDto {
  @IsString()
  name: string;
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(10)
  level: number;
  @IsString()
  @MinLength(3)
  trainer: string;
  @IsArray()
  abilities: string[];
}
