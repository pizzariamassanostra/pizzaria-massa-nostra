// ============================================
// DTO: CRIAR PEDIDO DE COMPRA
// ============================================
import {
  IsInt,
  IsString,
  // IsDecimal, Verificar regra***
  IsEnum,
  // IsDateString, Verificar regra***
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PurchaseOrderStatus } from '../enums/purchase-order-status.enum';
import { SupplierPaymentMethod } from '../enums/payment-method.enum';

export class PurchaseOrderItemDto {
  @IsString()
  product_name: string;

  @IsInt()
  quantity: number;

  @IsString()
  unit: string;

  @IsNumber()
  unit_price: number;

  @IsNumber()
  total_price: number;
}

export class CreatePurchaseOrderDto {
  @IsInt()
  supplier_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[];

  @IsNumber()
  total_value: number;

  @IsEnum(SupplierPaymentMethod)
  payment_method: SupplierPaymentMethod;

  @IsString()
  expected_delivery_date: string; // Aceita "2025-12-05"

  @IsString()
  @IsOptional()
  actual_delivery_date?: string; // Aceita "2025-12-05"

  @IsEnum(PurchaseOrderStatus)
  @IsOptional()
  status?: PurchaseOrderStatus;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsInt()
  @IsOptional()
  approved_by?: number;
}
