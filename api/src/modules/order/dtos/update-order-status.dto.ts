// ============================================
// DTO: ATUALIZAR STATUS DO PEDIDO
// ============================================

import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsIn(['pending', 'confirmed', 'preparing', 'on_delivery', 'delivered', 'cancelled'])
  status: string;

  @IsOptional()
  @IsString()
  notes?: string; // Motivo da mudança
}


