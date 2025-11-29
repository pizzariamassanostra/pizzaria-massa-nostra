// ============================================
// DTO: QUERY PARAMS PARA BUSCAR PRODUTOS
// ============================================
// Filtros opcionais para GET /product
// ============================================

import { IsOptional, IsString } from 'class-validator';

export class FindProductsQueryDto {
  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
