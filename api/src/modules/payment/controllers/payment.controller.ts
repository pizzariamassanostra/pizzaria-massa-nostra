// ============================================
// CONTROLLER: PAGAMENTOS
// ============================================
// Endpoints de pagamento
// ============================================

import { Controller, Get, Param } from '@nestjs/common';
import { QueryPaymentService } from '../services/find-one-payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly queryPaymentService: QueryPaymentService) {}

  // ============================================
  // ENDPOINT: BUSCAR UM PAGAMENTO
  // ============================================
  @Get('/find-one/:paymentId')
  async findOne(@Param('paymentId') paymentId: string) {
    const payment = await this.queryPaymentService.findOne({
      where: [{ id: paymentId }],
      relations: ['commonUser'],
    });

    return {
      ok: true,
      payment,
    };
  }

  // ============================================
  // ENDPOINT: LISTAR PAGAMENTOS
  // ============================================
  @Get('/list')
  async listPayments() {
    const result = await this.queryPaymentService.list({
      page: 1,
      per_page: 10,
      relations: ['commonUser'],
    });

    return {
      ok: true,
      ...result,
    };
  }
}
