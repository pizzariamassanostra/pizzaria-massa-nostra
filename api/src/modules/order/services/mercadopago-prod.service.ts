// ============================================
// SERVICE: MERCADO PAGO - PRODUÇÃO
// ============================================

import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

@Injectable()
export class MercadoPagoProdService {
  private client: MercadoPagoConfig;
  private payment: Payment;
  private preference: Preference;

  constructor() {
    const accessToken =
      process.env.MP_MODE === 'prod'
        ? process.env.MP_ACCESS_TOKEN_PROD
        : process.env.MP_ACCESS_TOKEN;

    this.client = new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 5000,
      },
    });

    this.payment = new Payment(this.client);
    this.preference = new Preference(this.client);
  }

  /**
   * Gerar QR Code PIX
   */
  async generatePixQRCode(orderId: number, amount: number) {
    const body = {
      transaction_amount: amount,
      description: `Pedido #${orderId} - Pizzaria Massa Nostra`,
      payment_method_id: 'pix',
      payer: {
        email: 'cliente@pizzariamassanostra.com',
      },
    };

    const payment = await this.payment.create({ body });

    return {
      qr_code: payment.point_of_interaction.transaction_data.qr_code,
      qr_code_base64:
        payment.point_of_interaction.transaction_data.qr_code_base64,
      payment_id: payment.id,
    };
  }
}
