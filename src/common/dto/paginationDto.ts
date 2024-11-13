import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Min(0)
  offset?: number;
  @IsOptional()
  @IsPositive()
  @Min(0)
  @IsNumber()
  limit?: number;
}
