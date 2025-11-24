// ============================================
// REPOSITORY: COMPROVANTES
// ============================================
// Acesso ao banco de dados de comprovantes
// Pizzaria Massa Nostra
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
      relations: ['order', 'customer'],
    });
  }

  // ============================================
  // BUSCAR POR NÚMERO DO COMPROVANTE
  // ============================================
  async findByReceiptNumber(receiptNumber: string): Promise<Receipt> {
    return await this.receiptRepository.findOne({
      where: { receipt_number: receiptNumber },
      relations: ['order', 'customer'],
    });
  }

  // ============================================
  // BUSCAR POR PEDIDO
  // ============================================
  async findByOrderId(orderId: number): Promise<Receipt> {
    return await this.receiptRepository.findOne({
      where: { order_id: orderId },
      relations: ['order', 'customer'],
    });
  }

  // ============================================
  // LISTAR POR CLIENTE
  // ============================================
  async findByCustomerId(customerId: number): Promise<Receipt[]> {
    return await this.receiptRepository.find({
      where: { customer_id: customerId },
      order: { created_at: 'DESC' },
      relations: ['order'],
    });
  }

  // ============================================
  // ATUALIZAR
  // ============================================
  async update(id: number, data: Partial<Receipt>): Promise<Receipt> {
    await this.receiptRepository.update(id, data);
    return await this.findById(id);
  }
}
