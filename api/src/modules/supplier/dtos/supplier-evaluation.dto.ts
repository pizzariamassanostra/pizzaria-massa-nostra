// ============================================
// DTO: AVALIAR FORNECEDOR
// ============================================
import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';

export class SupplierEvaluationDto {
  @IsInt()
  supplier_id: number;

  @IsInt()
  @Min(1)
  @Max(5)
  quality_rating: number;

  @IsInt()
  @Min(1)
  @Max(5)
  delivery_rating: number;

  @IsInt()
  @Min(1)
  @Max(5)
  price_rating: number;

  @IsInt()
  @Min(1)
  @Max(5)
  service_rating: number;

  @IsString()
  @IsOptional()
  comments?: string;
}
