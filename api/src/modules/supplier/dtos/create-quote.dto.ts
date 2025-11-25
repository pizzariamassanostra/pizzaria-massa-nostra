// ============================================
// DTO: CRIAR COTAÇÃO
// ============================================
import {
  IsInt,
  IsString,
  IsOptional,
  // IsDecimal, Verificar regra***
  IsEnum,
  IsDateString,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuoteStatus } from '../enums/quote-status.enum';

export class QuoteItemDto {
  @IsString()
  product_name: string;

  @IsInt()
  quantity: number;

  @IsString()
  unit: string;

  @IsNumber()
  @IsOptional()
  estimated_price?: number;
}

export class CreateQuoteDto {
  @IsInt()
  supplier_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuoteItemDto)
  items: QuoteItemDto[];

  @IsNumber()
  @IsOptional()
  total_value?: number;

  @IsInt()
  @IsOptional()
  delivery_days?: number;

  @IsInt()
  @IsOptional()
  payment_days?: number;

  @IsEnum(QuoteStatus)
  @IsOptional()
  status?: QuoteStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  validity_date?: string;
}
