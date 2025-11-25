// ============================================
// SERVICE: COTAÇÕES DE FORNECEDORES
// ============================================
// Lógica de negócio para sistema de cotação
// Envio, recebimento, análise e aprovação
// Pizzaria Massa Nostra
// Desenvolvedor: @lucasitdias
// ============================================

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierQuote } from '../entities/supplier-quote.entity';
import { Supplier } from '../entities/supplier.entity';
import { CreateQuoteDto } from '../dtos/create-quote.dto';
import { QuoteStatus } from '../enums/quote-status.enum';

@Injectable()
export class SupplierQuoteService {
  constructor(
    @InjectRepository(SupplierQuote)
    private readonly quoteRepo: Repository<SupplierQuote>,

    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
  ) {}

  // ============================================
  // CRIAR COTAÇÃO
  // ============================================
  // Gera número único: COT-YYYYMMDD-XXX
  // Envia para fornecedor (futuro: email/WhatsApp)
  // ============================================
  async create(dto: CreateQuoteDto): Promise<SupplierQuote> {
    // Validar se fornecedor existe e está ativo
    const supplier = await this.supplierRepo.findOne({
      where: { id: dto.supplier_id, deleted_at: null },
    });

    if (!supplier) {
      throw new NotFoundException(
        `Fornecedor #${dto.supplier_id} não encontrado`,
      );
    }

    if (supplier.status !== 'active') {
      throw new BadRequestException(
        `Fornecedor #${dto.supplier_id} não está ativo para receber cotações`,
      );
    }

    // ============================================
    // GERAR NÚMERO DA COTAÇÃO
    // ============================================
    const quoteNumber = await this.generateQuoteNumber();

    // ============================================
    // CONVERTER ITENS PARA JSON
    // ============================================
    const itemsJson = JSON.stringify(dto.items);

    // ============================================
    // CRIAR COTAÇÃO
    // ============================================
    const quote = this.quoteRepo.create({
      supplier_id: dto.supplier_id,
      quote_number: quoteNumber,
      items_json: itemsJson,
      total_value: dto.total_value,
      delivery_days: dto.delivery_days,
      payment_days: dto.payment_days,
      status: dto.status || QuoteStatus.PENDING,
      notes: dto.notes,
      validity_date: dto.validity_date,
    });

    const savedQuote = await this.quoteRepo.save(quote);

    // TODO: Enviar email/WhatsApp para fornecedor
    console.log(
      `📧 Cotação ${quoteNumber} criada para fornecedor #${dto.supplier_id}`,
    );

    return savedQuote;
  }

  // ============================================
  // GERAR NÚMERO ÚNICO DA COTAÇÃO
  // ============================================
  // Formato: COT-20251124-001
  // ============================================
  private async generateQuoteNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Buscar a ÚLTIMA cotação do dia para garantir sequência
    const lastQuote = await this.quoteRepo
      .createQueryBuilder('quote')
      .where('quote.quote_number LIKE :pattern', { pattern: `COT-${dateStr}%` })
      .orderBy('quote.id', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastQuote) {
      // Extrair número da última cotação e incrementar
      const lastNumber = lastQuote.quote_number.split('-').pop();
      sequence = parseInt(lastNumber || '0', 10) + 1;
    }

    return `COT-${dateStr}-${String(sequence).padStart(3, '0')}`;
  }

  // ============================================
  // LISTAR TODAS AS COTAÇÕES
  // ============================================
  async findAll(filters?: {
    status?: QuoteStatus;
    supplier_id?: number;
  }): Promise<SupplierQuote[]> {
    const query = this.quoteRepo
      .createQueryBuilder('quote')
      .leftJoinAndSelect('quote.supplier', 'supplier');

    if (filters?.status) {
      query.andWhere('quote.status = :status', { status: filters.status });
    }

    if (filters?.supplier_id) {
      query.andWhere('quote.supplier_id = :supplier_id', {
        supplier_id: filters.supplier_id,
      });
    }

    query.orderBy('quote.created_at', 'DESC');

    return query.getMany();
  }

  // ============================================
  // BUSCAR COTAÇÃO POR ID
  // ============================================
  async findOne(id: number): Promise<SupplierQuote> {
    const quote = await this.quoteRepo.findOne({
      where: { id },
      relations: ['supplier'],
    });

    if (!quote) {
      throw new NotFoundException(`Cotação #${id} não encontrada`);
    }

    return quote;
  }

  // ============================================
  // BUSCAR COTAÇÃO POR NÚMERO
  // ============================================
  async findByNumber(quoteNumber: string): Promise<SupplierQuote> {
    const quote = await this.quoteRepo.findOne({
      where: { quote_number: quoteNumber },
      relations: ['supplier'],
    });

    if (!quote) {
      throw new NotFoundException(`Cotação ${quoteNumber} não encontrada`);
    }

    return quote;
  }

  // ============================================
  // ATUALIZAR COTAÇÃO (FORNECEDOR RESPONDE)
  // ============================================
  async update(
    id: number,
    updates: {
      total_value?: number;
      delivery_days?: number;
      payment_days?: number;
      notes?: string;
    },
  ): Promise<SupplierQuote> {
    const quote = await this.findOne(id);

    if (quote.status === QuoteStatus.CANCELLED) {
      throw new BadRequestException(
        'Cotação cancelada não pode ser atualizada',
      );
    }

    if (quote.status === QuoteStatus.CONVERTED) {
      throw new BadRequestException(
        'Cotação já foi convertida em pedido de compra',
      );
    }

    Object.assign(quote, updates);
    quote.status = QuoteStatus.RECEIVED; // Marca como recebida

    return this.quoteRepo.save(quote);
  }

  // ============================================
  // ALTERAR STATUS DA COTAÇÃO
  // ============================================
  async changeStatus(
    id: number,
    newStatus: QuoteStatus,
  ): Promise<SupplierQuote> {
    const quote = await this.findOne(id);
    quote.status = newStatus;
    return this.quoteRepo.save(quote);
  }

  // ============================================
  // APROVAR COTAÇÃO
  // ============================================
  async approve(id: number): Promise<SupplierQuote> {
    return this.changeStatus(id, QuoteStatus.APPROVED);
  }

  // ============================================
  // CANCELAR COTAÇÃO
  // ============================================
  async cancel(id: number, reason?: string): Promise<SupplierQuote> {
    const quote = await this.findOne(id);
    quote.status = QuoteStatus.CANCELLED;
    quote.notes = reason || 'Cotação cancelada';
    return this.quoteRepo.save(quote);
  }

  // ============================================
  // CONVERTER EM PEDIDO DE COMPRA
  // ============================================
  async convertToPurchaseOrder(id: number): Promise<SupplierQuote> {
    const quote = await this.findOne(id);

    if (quote.status !== QuoteStatus.APPROVED) {
      throw new BadRequestException(
        'Apenas cotações aprovadas podem ser convertidas',
      );
    }

    quote.status = QuoteStatus.CONVERTED;
    return this.quoteRepo.save(quote);
  }
}
