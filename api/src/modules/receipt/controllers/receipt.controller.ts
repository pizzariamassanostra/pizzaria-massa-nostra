// ============================================
// CONTROLLER: COMPROVANTES
// ============================================
// Endpoints de comprovantes
// Pizzaria Massa Nostra
// ============================================

import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ReceiptService } from '../services/receipt.service';

import { JwtFlexibleAuthGuard } from '@/common/guards/jwt-flexible-auth.guard';

@Controller('receipt')
// 🔧 AJUSTE: aplicar o guard globalmente como no segundo controller
@UseGuards(JwtFlexibleAuthGuard)
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  // ============================================
  // BUSCAR COMPROVANTE POR PEDIDO
  // ============================================
  @Get('order/:orderId')
  async getByOrderId(@Param('orderId', ParseIntPipe) orderId: number) {
    // 🔧 AJUSTE: garantir que orderId seja number → ParseIntPipe
    const receipt = await this.receiptService.findByOrder(orderId);

    return {
      ok: true,
      receipt: {
        id: receipt.id,
        receipt_number: receipt.receipt_number,
        pdf_url: receipt.pdf_url,
        total_amount: receipt.total_amount,
        payment_method: receipt.payment_method,
        customer_name: receipt.customer_name, // 🔧 adicionado do segundo controller
        created_at: receipt.created_at,
      },
    };
  }

  // ============================================
  // BUSCAR POR NÚMERO DO COMPROVANTE
  // ============================================
  @Get('number/:receiptNumber')
  async getByReceiptNumber(@Param('receiptNumber') receiptNumber: string) {
    const receipt = await this.receiptService.findByNumber(receiptNumber);

    return {
      ok: true,
      receipt: {
        id: receipt.id,
        receipt_number: receipt.receipt_number,
        pdf_url: receipt.pdf_url,
        total_amount: receipt.total_amount,
        payment_method: receipt.payment_method,
        customer_name: receipt.customer_name,
        created_at: receipt.created_at,
      },
    };
  }

  // ============================================
  // REEMITIR COMPROVANTE
  // ============================================
  @Get('reissue/:orderId')
  async reissue(@Param('orderId', ParseIntPipe) orderId: number) {
    // 🔧 AJUSTE: garantir número inteiro via ParseIntPipe
    const receipt = await this.receiptService.reissue(orderId);

    return {
      ok: true,
      message: 'Comprovante reemitido com sucesso',
      receipt: {
        receipt_number: receipt.receipt_number,
        pdf_url: receipt.pdf_url,
      },
    };
  }
}
