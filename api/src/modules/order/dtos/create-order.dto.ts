// ============================================
// DTO: CRIAR PEDIDO
// ============================================

import { IsInt, IsOptional, IsString, IsArray, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @IsInt()
  common_user_id: number; // ID do cliente

  @IsInt()
  address_id: number; // ID do endereço de entrega

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[]; // Itens do pedido

  @IsIn(['pix', 'dinheiro', 'cartao_debito', 'cartao_credito'])
  payment_method: string;

  @IsOptional()
  @IsString()
  notes?: string; // Observações do pedido
}


