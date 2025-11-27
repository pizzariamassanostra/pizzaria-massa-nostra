// ============================================
// DTO: CRIAR PEDIDO
// ============================================
// Define os campos obrigatórios para criar um pedido
// O ID do cliente é extraído automaticamente do JWT
// ============================================

import {
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  /**
   * ID DO ENDEREÇO DE ENTREGA
   *
   * Obrigatório: Cliente precisa ter um endereço cadastrado
   * O sistema valida se o endereço pertence ao cliente logado
   */
  @IsInt({ message: 'ID do endereço deve ser um número inteiro' })
  address_id: number;

  /**
   * ITENS DO PEDIDO
   *
   * Lista de produtos que o cliente está pedindo
   * Cada item contém:
   * - product_id: ID do produto
   * - variant_id: Tamanho (P/M/G)
   * - crust_id: Tipo de borda
   * - filling_id: Recheio da borda (opcional)
   * - quantity: Quantidade
   * - notes: Observações (opcional)
   */
  @IsArray({ message: 'Itens deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  /**
   * FORMA DE PAGAMENTO
   *
   * Opções disponíveis:
   * - pix: Pagamento via PIX
   * - dinheiro: Pagamento em dinheiro na entrega
   * - cartao_debito: Cartão de débito na entrega
   * - cartao_credito: Cartão de crédito na entrega
   */
  @IsIn(['pix', 'dinheiro', 'cartao_debito', 'cartao_credito'], {
    message: 'Forma de pagamento inválida',
  })
  payment_method: string;

  /**
   * OBSERVAÇÕES DO PEDIDO (OPCIONAL)
   *
   * Cliente pode adicionar observações gerais sobre o pedido
   * Exemplo: "Entregar no portão dos fundos"
   */
  @IsOptional()
  @IsString({ message: 'Observações deve ser um texto' })
  notes?: string;
  common_user_id: number;
}
