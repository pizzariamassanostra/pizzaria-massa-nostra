// ============================================
// DTO: CRIAR PRODUTO
// ============================================

import { IsString, IsOptional, IsInt, IsIn, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVariantDto {
  @IsString()
  size: string; // small, medium, large, unique

  @IsString()
  label: string; // "Pequena - 4 pedaços"

  @IsInt()
  price: number; // Preço em centavos (ex: 3500 = R$ 35,00)

  @IsOptional()
  @IsInt()
  servings?: number; // Número de pedaços
}

export class CreateProductDto {
  @IsInt({ message: 'ID da categoria é obrigatório' })
  category_id: number;

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

  @IsIn(['simple', 'pizza'])
  type: string; // simple (bebida), pizza (várias variações)

  @IsOptional()
  @IsIn(['active', 'inactive', 'out_of_stock'])
  status?: string;

  @IsOptional()
  @IsInt()
  sort_order?: number;

  // Variações (tamanhos e preços)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];
}


