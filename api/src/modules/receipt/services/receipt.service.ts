// ============================================
// SERVICE: COMPROVANTES
// ============================================
// Geração de comprovantes de compra em PDF
// Cria snapshot do pedido e gera PDF formatado
// Pizzaria Massa Nostra
// Desenvolvedor: @lucasitdias
// ============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receipt } from '../entities/receipt.entity';
import { Order } from '@/modules/order/entities/order.entity';
const PDFDocument = require('pdfkit'); // ✅ ÚNICA MUDANÇA: LINHA 15

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepo: Repository<Receipt>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  // ============================================
  // GERAR COMPROVANTE APÓS PAGAMENTO
  // ============================================
  // Cria um novo comprovante com snapshot do pedido
  // Se já existir, retorna o existente
  // @param orderId - ID do pedido
  // @returns Promise<Receipt>
  // ============================================
  async generateReceipt(orderId: number): Promise<Receipt> {
    // Buscar pedido completo com todas as relações necessárias
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: [
        'customer', // Dados do cliente
        'items', // Itens do pedido
        'items.product', // Produto de cada item
        'items.variant', // Variação (tamanho) de cada item
        'payment', // Dados do pagamento
      ],
    });

    // Validar se pedido existe
    if (!order) {
      throw new NotFoundException(`Pedido #${orderId} não encontrado`);
    }

    // Verificar se já existe comprovante para este pedido
    // Evita duplicação de comprovantes
    const existing = await this.receiptRepo.findOne({
      where: { order_id: orderId },
    });

    if (existing) {
      return existing; // Retorna comprovante existente
    }

    // Gerar número único do comprovante
    // Formato: REC-YYYYMMDD-XXXX
    const receiptNumber = await this.generateReceiptNumber();

    // Criar objeto comprovante com snapshot do pedido
    const receipt = this.receiptRepo.create({
      // Relacionamento
      order_id: orderId,

      // Número único
      receipt_number: receiptNumber,

      // Dados do cliente (snapshot)
      customer_name: order.customer.nome_completo,
      customer_cpf: order.customer.cpf || null,
      customer_email: order.customer.email || null,

      // Itens em formato JSON
      items_json: JSON.stringify(
        order.items.map((item) => ({
          product_name: item.product.name,
          variant_name: item.variant?.size || 'Padrão',
          quantity: item.quantity,
          // ✅ CORREÇÃO: usar unit_price e total_price (nomes corretos)
          unit_price: parseFloat(item.unit_price.toString()),
          total_price: parseFloat(item.total_price.toString()),
        })),
      ),

      // Valores do pedido
      subtotal: order.subtotal,
      delivery_fee: order.delivery_fee,
      discount: order.discount,
      total: order.total,

      // Forma de pagamento
      payment_method: order.payment_method,

      // Data de emissão
      issue_date: new Date(),
    });

    // Salvar no banco de dados
    return this.receiptRepo.save(receipt);
  }

  // ============================================
  // GERAR NÚMERO ÚNICO DO COMPROVANTE
  // ============================================
  // Formato: REC-YYYYMMDD-XXXX
  // Exemplo: REC-20251126-0001
  // Sequência reinicia a cada dia
  // @returns Promise<string>
  // ============================================
  private async generateReceiptNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Buscar último comprovante do dia
    const lastReceipt = await this.receiptRepo
      .createQueryBuilder('receipt')
      .where('receipt.receipt_number LIKE :pattern', {
        pattern: `REC-${dateStr}%`,
      })
      .orderBy('receipt.id', 'DESC')
      .getOne();

    // Definir próxima sequência
    let sequence = 1;
    if (lastReceipt) {
      const lastNumber = lastReceipt.receipt_number.split('-').pop();
      sequence = parseInt(lastNumber || '0', 10) + 1;
    }

    // Retornar número formatado
    return `REC-${dateStr}-${String(sequence).padStart(4, '0')}`;
  }

  // ============================================
  // BUSCAR COMPROVANTE POR PEDIDO
  // ============================================
  // @param orderId - ID do pedido
  // @returns Promise<Receipt>
  // @throws NotFoundException se não encontrar
  // ============================================
  async findByOrder(orderId: number): Promise<Receipt> {
    const receipt = await this.receiptRepo.findOne({
      where: { order_id: orderId },
      relations: ['order'], // Incluir dados do pedido
    });

    if (!receipt) {
      throw new NotFoundException(
        `Comprovante para pedido #${orderId} não encontrado`,
      );
    }

    return receipt;
  }

  // ============================================
  // BUSCAR COMPROVANTE POR NÚMERO
  // ============================================
  // @param receiptNumber - Número do comprovante (REC-YYYYMMDD-XXXX)
  // @returns Promise<Receipt>
  // @throws NotFoundException se não encontrar
  // ============================================
  async findByNumber(receiptNumber: string): Promise<Receipt> {
    const receipt = await this.receiptRepo.findOne({
      where: { receipt_number: receiptNumber },
      relations: ['order'],
    });

    if (!receipt) {
      throw new NotFoundException(
        `Comprovante ${receiptNumber} não encontrado`,
      );
    }

    return receipt;
  }

  // ============================================
  // GERAR PDF DO COMPROVANTE
  // ============================================
  // Gera PDF formatado com dados do comprovante
  // @param receiptId - ID do comprovante
  // @returns Promise<Buffer> - Buffer do PDF gerado
  // @throws NotFoundException se comprovante não existir
  // ============================================
  async generatePDF(receiptId: number): Promise<Buffer> {
    // Buscar comprovante
    const receipt = await this.receiptRepo.findOne({
      where: { id: receiptId },
      relations: ['order'],
    });

    if (!receipt) {
      throw new NotFoundException(`Comprovante #${receiptId} não encontrado`);
    }

    // Retornar Promise com Buffer do PDF
    return new Promise((resolve, reject) => {
      try {
        // Criar documento PDF com configurações
        const doc = new PDFDocument({
          size: 'A4', // Tamanho A4
          margin: 50, // Margem de 50px
          info: {
            Title: `Comprovante ${receipt.receipt_number}`,
            Author: 'Pizzaria Massa Nostra',
            Subject: 'Comprovante de Compra',
            Creator: 'Sistema Pizzaria Massa Nostra',
          },
        });

        // Array para armazenar chunks do PDF
        const chunks: Buffer[] = [];

        // Eventos do documento
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // ============================================
        // SEÇÃO 1: CABEÇALHO
        // ============================================
        doc
          .fontSize(20)
          .font('Helvetica-Bold')
          .text('PIZZARIA MASSA NOSTRA', { align: 'center' });

        doc
          .fontSize(10)
          .font('Helvetica')
          .text('CNPJ: 12. 345.678/0001-90', { align: 'center' })
          .text('Avenida Exemplo, 1000 - Centro - Montes Claros/MG', {
            align: 'center',
          })
          .text('Telefone: (38) 3221-0000', { align: 'center' })
          .moveDown(2);

        // ============================================
        // SEÇÃO 2: TÍTULO
        // ============================================
        doc
          .fontSize(16)
          .font('Helvetica-Bold')
          .text('COMPROVANTE DE COMPRA', { align: 'center' })
          .moveDown(1);

        // ============================================
        // SEÇÃO 3: INFORMAÇÕES DO COMPROVANTE
        // ============================================
        doc.fontSize(10).font('Helvetica');

        const y = doc.y;
        // Número do comprovante (esquerda)
        doc.text(`Número: ${receipt.receipt_number}`, 50, y);
        // Data de emissão (direita)
        doc.text(
          `Data: ${new Date(receipt.issue_date).toLocaleString('pt-BR')}`,
          300,
          y,
          { align: 'right' },
        );
        doc.moveDown(2);

        // ============================================
        // SEÇÃO 4: DADOS DO CLIENTE
        // ============================================
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('DADOS DO CLIENTE')
          .moveDown(0.5);

        doc.fontSize(10).font('Helvetica');
        doc.text(`Nome: ${receipt.customer_name}`);

        // Campos opcionais (só exibe se existir)
        if (receipt.customer_cpf) {
          doc.text(`CPF: ${receipt.customer_cpf}`);
        }
        if (receipt.customer_email) {
          doc.text(`Email: ${receipt.customer_email}`);
        }
        doc.moveDown(2);

        // ============================================
        // SEÇÃO 5: TABELA DE ITENS
        // ============================================
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('ITENS DO PEDIDO')
          .moveDown(0.5);

        // Cabeçalho da tabela
        const tableTop = doc.y;
        doc.fontSize(9).font('Helvetica-Bold');
        doc.text('Item', 50, tableTop);
        doc.text('Qtd', 300, tableTop, { width: 50, align: 'center' });
        doc.text('Valor Un. ', 350, tableTop, { width: 80, align: 'right' });
        doc.text('Total', 450, tableTop, { width: 90, align: 'right' });

        // Linha separadora
        doc
          .moveTo(50, tableTop + 15)
          .lineTo(540, tableTop + 15)
          .stroke();

        // Parse dos itens JSON
        const items = JSON.parse(receipt.items_json);
        let yPos = tableTop + 25;

        doc.fontSize(9).font('Helvetica');

        // Iterar sobre cada item
        items.forEach((item: any) => {
          const itemName = `${item.product_name} (${item.variant_name})`;

          // Nome do item
          doc.text(itemName, 50, yPos, { width: 240 });

          // Quantidade
          doc.text(item.quantity.toString(), 300, yPos, {
            width: 50,
            align: 'center',
          });

          // Valor unitário
          doc.text(
            item.unit_price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }),
            350,
            yPos,
            { width: 80, align: 'right' },
          );

          // Total do item
          doc.text(
            item.total_price.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }),
            450,
            yPos,
            { width: 90, align: 'right' },
          );

          yPos += 20;
        });

        // Linha final da tabela
        doc.moveTo(50, yPos).lineTo(540, yPos).stroke();
        yPos += 15;

        // ============================================
        // SEÇÃO 6: TOTAIS
        // ============================================
        doc.fontSize(10).font('Helvetica');

        // Subtotal
        doc.text('Subtotal:', 350, yPos);
        doc.text(
          parseFloat(receipt.subtotal.toString()).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          450,
          yPos,
          { width: 90, align: 'right' },
        );
        yPos += 15;

        // Taxa de entrega
        doc.text('Taxa de Entrega:', 350, yPos);
        doc.text(
          parseFloat(receipt.delivery_fee.toString()).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          450,
          yPos,
          { width: 90, align: 'right' },
        );
        yPos += 15;

        // Desconto (se houver)
        if (parseFloat(receipt.discount.toString()) > 0) {
          doc.fillColor('red'); // Desconto em vermelho
          doc.text('Desconto:', 350, yPos);
          doc.text(
            `-${parseFloat(receipt.discount.toString()).toLocaleString(
              'pt-BR',
              {
                style: 'currency',
                currency: 'BRL',
              },
            )}`,
            450,
            yPos,
            { width: 90, align: 'right' },
          );
          doc.fillColor('black'); // Voltar para preto
          yPos += 15;
        }

        // Linha antes do total
        doc.moveTo(350, yPos).lineTo(540, yPos).stroke();
        yPos += 10;

        // TOTAL FINAL (destacado)
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text('TOTAL:', 350, yPos);
        doc.text(
          parseFloat(receipt.total.toString()).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          450,
          yPos,
          { width: 90, align: 'right' },
        );

        yPos += 30;

        // ============================================
        // SEÇÃO 7: FORMA DE PAGAMENTO
        // ============================================
        doc.fontSize(10).font('Helvetica');

        // Mapeamento de códigos para nomes amigáveis
        const paymentMethodMap: Record<string, string> = {
          pix: 'PIX',
          credit_card: 'Cartão de Crédito',
          debit_card: 'Cartão de Débito',
          cash: 'Dinheiro',
          voucher: 'Vale Refeição',
        };

        doc.text(
          `Forma de Pagamento: ${
            paymentMethodMap[receipt.payment_method] ||
            receipt.payment_method.toUpperCase()
          }`,
          50,
          yPos,
        );

        // ============================================
        // SEÇÃO 8: RODAPÉ
        // ============================================
        doc
          .fontSize(8)
          .font('Helvetica')
          .text('Obrigado pela preferência!  Volte sempre! ', 50, 700, {
            align: 'center',
          })
          .text('Este documento não possui valor fiscal', {
            align: 'center',
          })
          .text(`Documento gerado em ${new Date().toLocaleString('pt-BR')}`, {
            align: 'center',
          });

        // Finalizar PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============================================
  // REEMITIR COMPROVANTE
  // ============================================
  // Busca comprovante existente ou gera um novo
  // @param orderId - ID do pedido
  // @returns Promise<Receipt>
  // ============================================
  async reissue(orderId: number): Promise<Receipt> {
    // Tentar buscar comprovante existente
    const existing = await this.receiptRepo.findOne({
      where: { order_id: orderId },
    });

    // Se existir, retornar
    if (existing) {
      return existing;
    }

    // Se não existir, gerar novo
    return this.generateReceipt(orderId);
  }
}
