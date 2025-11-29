// ============================================
// CONTROLLER: WEBHOOK MERCADO PAGO
// ============================================
// Recebe notificações de pagamento do Mercado Pago
// Processa aprovação e envia comprovante por e-mail
// ============================================

import {
  Controller,
  Post,
  Body,
  Headers,
  Query,
  HttpCode,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { Order } from '../../order/entities/order.entity';
import { ValidateWebhookService } from '../services/validate-payment-webhook.service';
import { ReceiptService } from '../../receipt/services/receipt.service';
import { NotificationService } from '../../notification/services/notification.service';
import { NotificationGateway } from '../../notification/notification.gateway';

@Controller('webhook')
export class WebhookController {
  // Logger para rastreamento de webhooks
  private readonly logger = new Logger(WebhookController.name);

  // ============================================
  // CONSTRUCTOR
  // ============================================
  // Injeta repositórios e serviços necessários
  // ============================================
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    private readonly validateWebhookService: ValidateWebhookService,
    private readonly receiptService: ReceiptService,
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  // ============================================
  // WEBHOOK MERCADO PAGO
  // ============================================
  // POST /webhook/mercadopago
  //
  // Recebe notificações do Mercado Pago sobre:
  // - Mudanças de status de pagamento
  // - Aprovação, rejeição, cancelamento
  //
  // Fluxo quando pagamento aprovado:
  // 1. Valida assinatura do webhook
  // 2. Atualiza status do pagamento
  // 3. Atualiza status do pedido
  // 4. Gera comprovante PDF
  // 5. Envia e-mail para cliente
  // 6. Notifica admin por e-mail
  // 7. Envia notificações WebSocket
  // ============================================
  @Post('mercadopago')
  @HttpCode(200)
  async handleMercadoPagoWebhook(
    @Headers('x-signature') signature: string,
    @Headers('x-request-id') requestId: string,
    @Query('data.id') dataId: string,
    @Body() body: any,
  ) {
    try {
      this.logger.log(`📨 Webhook recebido - Data ID: ${dataId}`);

      // ============================================
      // VALIDAR ASSINATURA DO WEBHOOK
      // ============================================
      // Garante que a requisição vem do Mercado Pago
      // Evita webhooks falsos/maliciosos
      if (signature && requestId && dataId) {
        await this.validateWebhookService.validateWebhook(
          signature,
          dataId,
          requestId,
        );
        this.logger.log('Assinatura validada');
      }

      // ============================================
      // PROCESSAR NOTIFICAÇÃO
      // ============================================
      const { type, data } = body;

      // Só processar eventos de pagamento
      if (type !== 'payment') {
        this.logger.warn(`Tipo de evento ignorado: ${type}`);
        return { ok: true, message: 'Evento ignorado' };
      }

      const paymentId = data.id;
      this.logger.log(`Processando pagamento ${paymentId}`);

      // ============================================
      // BUSCAR PAGAMENTO NO BANCO
      // ============================================
      const payment = await this.paymentRepo.findOne({
        where: { id: paymentId.toString() },
        relations: ['commonUser'],
      });

      if (!payment) {
        this.logger.warn(`Pagamento ${paymentId} não encontrado no banco`);
        return { ok: true, message: 'Pagamento não encontrado' };
      }

      // ============================================
      // BUSCAR PEDIDO RELACIONADO
      // ============================================
      const order = await this.orderRepo.findOne({
        where: { id: payment.order_id },
        relations: [
          'customer',
          'items',
          'items.product',
          'items.variant',
          'delivery_address',
        ],
      });

      if (!order) {
        this.logger.warn(`Pedido ${payment.order_id} não encontrado`);
        return { ok: true, message: 'Pedido não encontrado' };
      }

      // ============================================
      // ATUALIZAR STATUS DO PAGAMENTO
      // ============================================
      const previousStatus = payment.status;
      payment.status = this.mapMercadoPagoStatus(data.status);
      payment.updated_at = new Date();

      await this.paymentRepo.save(payment);

      this.logger.log(
        `Status do pagamento atualizado: ${previousStatus} → ${payment.status}`,
      );

      // ============================================
      // SE PAGAMENTO APROVADO → PROCESSAR
      // ============================================
      if (payment.status === 'approved' && previousStatus !== 'approved') {
        this.logger.log('Pagamento aprovado!  Processando.. .');

        // Atualizar status do pedido
        order.status = 'confirmed';
        await this.orderRepo.save(order);
        this.logger.log('Pedido confirmado');

        // ============================================
        // GERAR COMPROVANTE E ENVIAR E-MAIL
        // ============================================
        try {
          const receipt = await this.receiptService.generateReceipt(
            order.id,
            true, // Enviar e-mail automaticamente
          );

          this.logger.log(
            `Comprovante ${receipt.receipt_number} gerado e enviado por e-mail`,
          );
        } catch (error) {
          this.logger.error('Erro ao gerar/enviar comprovante:', error.message);
        }

        try {
          await this.notificationService.notifyNewOrder(
            String(order.order_number),
            String(order.customer?.nome_completo || 'Cliente'),
            Number(parseFloat(order.total.toString())),
          );

          this.logger.log('Admin notificado por e-mail');
        } catch (error) {
          this.logger.error('Erro ao notificar admin:', error.message);
        }

        // ============================================
        // NOTIFICAR VIA WEBSOCKET
        // ============================================
        try {
          // Notificar cliente sobre pagamento aprovado
          this.notificationGateway.notifyPaymentApproved(order.id);

          // Notificar admin sobre novo pedido
          this.notificationGateway.notifyNewOrder(order.id, {
            order_number: order.order_number,
            customer: order.customer?.nome_completo || 'Cliente',
            total: parseFloat(order.total.toString()),
          });

          this.logger.log('Notificações WebSocket enviadas');
        } catch (error) {
          this.logger.error('Erro ao enviar WebSocket:', error.message);
        }
      }

      // ============================================
      // RETORNAR SUCESSO
      // ============================================
      return {
        ok: true,
        message: 'Webhook processado com sucesso',
        payment_status: payment.status,
      };
    } catch (error) {
      // Log detalhado de erro
      this.logger.error('Erro ao processar webhook:', error.message);
      this.logger.error('Stack:', error.stack);

      return {
        ok: false,
        error: error.message,
      };
    }
  }

  // ============================================
  // MAPEAR STATUS DO MERCADO PAGO
  // ============================================
  // Converte status do MP para nosso padrão
  //
  // Status do Mercado Pago:
  // - approved: Pagamento aprovado
  // - pending: Aguardando pagamento
  // - in_process: Em processamento
  // - rejected: Recusado
  // - cancelled: Cancelado
  // - refunded: Estornado
  // - charged_back: Chargeback
  // ============================================
  private mapMercadoPagoStatus(mpStatus: string): string {
    const statusMap = {
      approved: 'approved',
      pending: 'pending',
      in_process: 'pending',
      rejected: 'rejected',
      cancelled: 'cancelled',
      refunded: 'refunded',
      charged_back: 'refunded',
    };

    return statusMap[mpStatus] || 'pending';
  }
}
