// ============================================
// DTO: CRIAR CATEGORIA
// ============================================

import { IsString, IsOptional, IsInt, IsIn } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Nome é obrigatório' })
  name: string;

  @IsString({ message: 'Slug é obrigatório' })
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsInt()
  sort_order?: number;

  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string;
}

