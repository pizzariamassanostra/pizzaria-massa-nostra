// ============================================
// CONTROLLER: WEBHOOK MERCADO PAGO
// ============================================

import { Controller, Post, Body, Headers, HttpCode } from '@nestjs/common';
import { MercadoPagoService } from '../services/mercadopago.service';
import { OrderService } from '../services/order.service';

@Controller('webhook')
export class WebhookController {
  constructor(
    private readonly mercadopagoService: MercadoPagoService,
    private readonly orderService: OrderService,
  ) {}

  // ============================================
  // WEBHOOK: Notificação de Pagamento
  // ============================================
  @Post('mercadopago')
  @HttpCode(200)
  async handleMercadoPagoNotification(
    @Body() body: any,
    @Headers('x-signature') signature: string,
  ) {
    console.log('📥 Webhook Mercado Pago recebido:', body);

    // Validar assinatura (segurança)
    // TODO: Implementar validação de assinatura

    // Se for notificação de pagamento
    if (body.type === 'payment') {
      const paymentId = body.data.id;

      // Buscar status do pagamento
      const paymentStatus = await this.mercadopagoService.getPaymentStatus(paymentId);

      console.log('💳 Status do pagamento:', paymentStatus);

      // Se aprovado, atualizar pedido
      if (paymentStatus.status === 'approved') {
        // TODO: Buscar order_id pelo payment_id
        // TODO: Atualizar status do pedido para 'confirmed'
        console.log('✅ Pagamento aprovado! Atualizar pedido.');
      }
    }

    return { ok: true };
  }
}

