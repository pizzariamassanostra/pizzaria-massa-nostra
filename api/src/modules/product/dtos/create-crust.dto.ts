// ============================================
// DTO: CRIAR BORDA
// ============================================

import { IsString, IsOptional, IsInt, IsIn } from 'class-validator';

export class CreateCrustDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  price_modifier: number; // Valor adicional em centavos

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;

  @IsOptional()
  @IsInt()
  sort_order?: number;
}


