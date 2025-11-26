// ============================================
// API: MERCADO PAGO
// ============================================
// Integração com Mercado Pago para pagamentos PIX
// ============================================

import axios from 'axios';
import { MercadoPagoPixRequest } from './interfaces/pix-request.interface';
import { MercadoPagoPixResponse } from './interfaces/pix-response.interface';

const MercadoPagoApi = axios.create({
  baseURL: 'https://api.mercadopago.com',
  headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
});

const createPixPayment = async (
  pixPaymentData: MercadoPagoPixRequest,
): Promise<MercadoPagoPixResponse> => {
  const { payment_id, order_id, user_id, user_phone, transaction_amount } =
    pixPaymentData;

  const { data } = await MercadoPagoApi.post(
    '/v1/payments',
    {
      transaction_amount: transaction_amount,
      payment_method_id: 'pix',
      payer: {
        email: process.env.LOG_EMAIL,
      },
      date_of_expiration: pixPaymentData.date_of_expiration,
      notification_url: `${process.env.MERCADOPAGO_WEBHOOK_URL}/webhook/mercadopago`,
      description: `Pedido #${order_id} - Cliente ID: ${user_id} - Tel: ${user_phone} - Payment: ${payment_id}`,
    },
    {
      headers: { 'X-Idempotency-Key': pixPaymentData.internal_payment_id },
    },
  );

  return data as MercadoPagoPixResponse;
};

export { MercadoPagoApi, createPixPayment };
