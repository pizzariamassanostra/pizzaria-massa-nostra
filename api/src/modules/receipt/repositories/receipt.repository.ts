// ============================================
// REPOSITORY: COMPROVANTES
// ============================================
// Acesso ao banco de dados de comprovantes
// Pizzaria Massa Nostra
// Desenvolvedor: @lucasitdias
// ============================================

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from '../entities/receipt.entity';

@Injectable()
export class ReceiptRepository {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,
  ) {}

  // ============================================
  // CRIAR COMPROVANTE
  // ============================================
  async create(receipt: Receipt): Promise<Receipt> {
    return await this.receiptRepository.save(receipt);
  }

  // ============================================
  // BUSCAR POR ID
  // ============================================
  async findById(id: number): Promise<Receipt> {
    return await this.receiptRepository.findOne({
      where: { id },
      // ✅ CORREÇÃO: Remover 'customer' pois não existe relacionamento direto
      relations: ['order'],
    });
  }

  // ============================================
  // BUSCAR POR NÚMERO DO COMPROVANTE
  // ============================================
  async findByReceiptNumber(receiptNumber: string): Promise<Receipt> {
    return await this.receiptRepository.findOne({
      where: { receipt_number: receiptNumber },
      // ✅ CORREÇÃO: Remover 'customer'
      relations: ['order'],
    });
  }

  // ============================================
  // BUSCAR POR PEDIDO
  // ============================================
  async findByOrderId(orderId: number): Promise<Receipt> {
    return await this.receiptRepository.findOne({
      where: { order_id: orderId },
      // ✅ CORREÇÃO: Remover 'customer'
      relations: ['order'],
    });
  }

  // ============================================
  // LISTAR POR CLIENTE
  // ============================================
  // ✅ CORREÇÃO COMPLETA: Buscar via relacionamento com Order
  // Pois Receipt não tem customer_id direto, apenas order_id
  // E Order tem common_user_id (que é o ID do cliente)
  async findByCustomerId(customerId: number): Promise<Receipt[]> {
    return await this.receiptRepository
      .createQueryBuilder('receipt')
      // Join com a tabela orders
      .innerJoin('receipt.order', 'order')
      // Filtrar pelo ID do cliente (que está em order.common_user_id)
      .where('order.common_user_id = :customerId', { customerId })
      // Ordenar do mais recente para o mais antigo
      .orderBy('receipt. created_at', 'DESC')
      // Incluir dados do pedido na resposta
      .leftJoinAndSelect('receipt.order', 'orderData')
      // Executar query e retornar resultados
      .getMany();
  }

  // ============================================
  // ATUALIZAR
  // ============================================
  async update(id: number, data: Partial<Receipt>): Promise<Receipt> {
    await this.receiptRepository.update(id, data);
    return await this.findById(id);
  }
}
