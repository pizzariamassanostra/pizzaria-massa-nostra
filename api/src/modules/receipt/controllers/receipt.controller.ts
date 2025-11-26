// ============================================
// CONTROLLER: COMPROVANTES
// ============================================
// Endpoints de comprovantes
// Pizzaria Massa Nostra
// Desenvolvedor: @lucasitdias
// ============================================

import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ReceiptService } from '../services/receipt.service';
import { JwtFlexibleAuthGuard } from '@/common/guards/jwt-flexible-auth.guard';

@Controller('receipt')
@UseGuards(JwtFlexibleAuthGuard)
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  // ============================================
  // GET /receipt/order/:orderId
  // Buscar comprovante por pedido (JSON)
  // ============================================
  @Get('order/:orderId')
  async getByOrderId(@Param('orderId', ParseIntPipe) orderId: number) {
    const receipt = await this.receiptService.findByOrder(orderId);

    return {
      ok: true,
      receipt: {
        id: receipt.id,
        receipt_number: receipt.receipt_number,
        customer_name: receipt.customer_name,
        total: receipt.total,
        payment_method: receipt.payment_method,
        issue_date: receipt.issue_date,
        created_at: receipt.created_at,
      },
    };
  }

  // ============================================
  // GET /receipt/order/:orderId/pdf
  // Baixar PDF do comprovante
  // ============================================
  @Get('order/:orderId/pdf')
  async getReceiptPdf(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Res() res: Response,
  ) {
    try {
      const receipt = await this.receiptService.findByOrder(orderId);
      const pdfBuffer = await this.receiptService.generatePDF(receipt.id);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="comprovante-${receipt.receipt_number}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });

      res.end(pdfBuffer);
    } catch (error) {
      throw error;
    }
  }

  // ============================================
  // GET /receipt/number/:receiptNumber
  // Buscar por número do comprovante
  // ============================================
  @Get('number/:receiptNumber')
  async getByReceiptNumber(@Param('receiptNumber') receiptNumber: string) {
    const receipt = await this.receiptService.findByNumber(receiptNumber);

    return {
      ok: true,
      receipt: {
        id: receipt.id,
        receipt_number: receipt.receipt_number,
        customer_name: receipt.customer_name,
        total: receipt.total,
        payment_method: receipt.payment_method,
        created_at: receipt.created_at,
      },
    };
  }

  // ============================================
  // GET /receipt/reissue/:orderId
  // Reemitir comprovante
  // ============================================
  @Get('reissue/:orderId')
  async reissue(@Param('orderId', ParseIntPipe) orderId: number) {
    const receipt = await this.receiptService.reissue(orderId);

    return {
      ok: true,
      message: 'Comprovante reemitido com sucesso',
      receipt: {
        receipt_number: receipt.receipt_number,
        total: receipt.total,
      },
    };
  }
}
