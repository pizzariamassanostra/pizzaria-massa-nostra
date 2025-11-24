// ============================================
// DTO: CRIAR RECHEIO DE BORDA
// ============================================

import { IsString, IsOptional, IsInt, IsIn } from 'class-validator';

export class CreateFillingDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  price: number; // Preço em centavos

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;

  @IsOptional()
  @IsInt()
  sort_order?: number;
}


