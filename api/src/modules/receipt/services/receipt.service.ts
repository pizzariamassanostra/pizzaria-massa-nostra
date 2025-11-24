// ============================================
// SERVICE: COMPROVANTES (RECEIPTS)
// ============================================
// Geração automática de comprovantes em PDF
// Upload para Cloudinary
// Integrado com OrderService
// Pizzaria Massa Nostra
// ============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from '../entities/receipt.entity';
import { Order } from '@/modules/order/entities/order.entity';
import { PdfGeneratorService } from './pdf-generator.service';
import { CloudinaryService } from '@/common/libs/cloudinary/cloudinary.service';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepo: Repository<Receipt>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    private readonly pdfGenerator: PdfGeneratorService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  // ============================================
  // GERAR COMPROVANTE PARA PEDIDO
  // ============================================
  // Chamado automaticamente quando pedido é confirmado
  // Gera PDF + Upload Cloudinary + Salva na tabela
  // ============================================
  async createForOrder(orderId: number): Promise<Receipt> {
    // ============================================
    // 1. VERIFICAR SE JÁ EXISTE COMPROVANTE
    // ============================================
    const existingReceipt = await this.receiptRepo.findOne({
      where: { order_id: orderId },
    });

    if (existingReceipt) {
      console.log(`ℹ️  Comprovante já existe para pedido #${orderId}`);
      return existingReceipt;
    }

    // ============================================
    // 2. BUSCAR PEDIDO COMPLETO (COM USER!)
    // ============================================
    const order = await this.orderRepo.findOne({
      where: { id: orderId, deleted_at: null },
      relations: [
        'user', // ⭐ ESSENCIAL: Carregar dados do cliente
        'address', // Endereço de entrega
        'items', // Itens do pedido
        'items.product', // Dados dos produtos
        'items.variant', // Variações (P, M, G)
      ],
    });

    if (!order) {
      throw new NotFoundException(`Pedido #${orderId} não encontrado`);
    }

    // ============================================
    // 3. GERAR NÚMERO ÚNICO DO COMPROVANTE
    // ============================================
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');

    // Contar quantos comprovantes já foram gerados hoje
    const count = await this.receiptRepo.count({
      where: {
        created_at: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        ),
      },
    });

    const receiptNumber = `COMP-${dateStr}-${String(count + 1).padStart(3, '0')}`;

    // ============================================
    // 4. PREPARAR DADOS DO COMPROVANTE
    // ============================================
    const receiptData = {
      receiptNumber,
      orderNumber: order.id,
      customerName: order.user?.name || 'Cliente',
      customerCpf: order.user?.cpf || '',
      customerEmail: order.user?.email || '',
      customerPhone: order.user?.phone || '',
      items: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        unit_price: parseFloat(item.unit_price.toString()),
        total_price: parseFloat(item.subtotal.toString()),
      })),
      subtotal: parseFloat(order.subtotal.toString()),
      deliveryFee: parseFloat(order.delivery_fee.toString()),
      total: parseFloat(order.total.toString()),
      paymentMethod: this.formatPaymentMethod(order.payment_method),
      createdAt: order.created_at,
    };

    // ============================================
    // 5. GERAR PDF EM MEMÓRIA
    // ============================================
    console.log(`📄 Gerando PDF do comprovante...`);
    const pdfBuffer = await this.pdfGenerator.generateReceipt(receiptData);

    // ============================================
    // 6. UPLOAD PARA CLOUDINARY
    // ============================================
    console.log(`☁️  Fazendo upload para Cloudinary...`);
    const uploadResult = await this.cloudinary.uploadPdf(
      pdfBuffer,
      `receipts/${receiptNumber}`,
    );

    // ============================================
    // 7. SALVAR COMPROVANTE NO BANCO
    // ============================================
    const receipt = this.receiptRepo.create({
      order_id: order.id,
      customer_id: order.common_user_id,
      receipt_number: receiptNumber,
      pdf_url: uploadResult.secure_url,
      total_amount: order.total,
      payment_method: order.payment_method,

      // ⭐ SNAPSHOT DOS DADOS (LGPD)
      customer_name: order.user?.name || 'Cliente',
      customer_cpf: order.user?.cpf || null,
      customer_email: order.user?.email || null,
      customer_phone: order.user?.phone || '',

      // JSON com itens para histórico
      items_json: JSON.stringify(receiptData.items),

      was_emailed: false,
    });

    const savedReceipt = await this.receiptRepo.save(receipt);

    console.log(`✅ Comprovante salvo com sucesso!`);
    console.log(`   Número: ${receiptNumber}`);
    console.log(`   PDF URL: ${uploadResult.secure_url}`);

    return savedReceipt;
  }

  // ============================================
  // BUSCAR COMPROVANTE POR PEDIDO
  // ============================================
  async findByOrder(orderId: number): Promise<Receipt> {
    const receipt = await this.receiptRepo.findOne({
      where: { order_id: orderId },
      relations: ['order', 'customer'],
    });

    if (!receipt) {
      throw new NotFoundException(
        `Comprovante não encontrado para pedido #${orderId}`,
      );
    }

    return receipt;
  }

  // ============================================
  // BUSCAR COMPROVANTE POR NÚMERO
  // ============================================
  async findByNumber(receiptNumber: string): Promise<Receipt> {
    const receipt = await this.receiptRepo.findOne({
      where: { receipt_number: receiptNumber },
      relations: ['order', 'customer'],
    });

    if (!receipt) {
      throw new NotFoundException(
        `Comprovante ${receiptNumber} não encontrado`,
      );
    }

    return receipt;
  }

  // ============================================
  // REEMITIR COMPROVANTE (GERA NOVO PDF)
  // ============================================
  async reissue(orderId: number): Promise<Receipt> {
    // Deletar comprovante existente
    await this.receiptRepo.delete({ order_id: orderId });

    // Gerar novo
    return this.createForOrder(orderId);
  }

  // ============================================
  // FORMATAR FORMA DE PAGAMENTO PARA EXIBIÇÃO
  // ============================================
  private formatPaymentMethod(method: string): string {
    const methodMap = {
      pix: 'PIX',
      dinheiro: 'Dinheiro',
      cartao_debito: 'Cartão de Débito',
      cartao_credito: 'Cartão de Crédito',
      cartao_refeicao: 'Cartão Refeição',
    };

    return methodMap[method] || method;
  }
}
