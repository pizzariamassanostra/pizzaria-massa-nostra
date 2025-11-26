// ===========================================
// NOTIFICATION SERVICE - PIZZARIA MASSA NOSTRA
// Serviço central de notificações
// Gerencia envio de e-mails, SMS e push notifications
//
// Referência: PIZZARIA-FASE-FINAL-COMPLETAR-MODULOS-PENDENTES
// Data: 2025-11-26 02:00:00 UTC
// Desenvolvedor: @lucasitdias
// Status: ✅ Implementado
// ===========================================

import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';

/**
 * Tipos de notificação suportados
 */
export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
}

/**
 * Interface para dados de notificação genérica
 */
export interface NotificationData {
  type: NotificationType; // Tipo da notificação
  recipient: string; // Destinatário (e-mail, telefone, token)
  subject?: string; // Assunto (apenas e-mail)
  message: string; // Mensagem/corpo
  data?: any; // Dados adicionais opcionais
}

@Injectable()
export class NotificationService {
  // Logger para rastreamento de notificações
  private readonly logger = new Logger(NotificationService.name);

  /**
   * Construtor - Injeta EmailService
   * @param emailService - Serviço de e-mail
   */
  constructor(private readonly emailService: EmailService) {
    this.logger.log('✅ NotificationService inicializado');
  }

  /**
   * Enviar notificação (roteador principal)
   * Decide qual canal usar baseado no tipo
   *
   * @param notificationData - Dados da notificação
   * @returns Promise<boolean> - true se enviado com sucesso
   */
  async send(notificationData: NotificationData): Promise<boolean> {
    try {
      this.logger.log(
        `📤 Enviando notificação ${notificationData.type} para ${notificationData.recipient}`,
      );

      // Roteamento por tipo de notificação
      switch (notificationData.type) {
        case NotificationType.EMAIL:
          return await this.sendEmail(notificationData);

        case NotificationType.SMS:
          return await this.sendSMS(notificationData);

        case NotificationType.PUSH:
          return await this.sendPush(notificationData);

        default:
          this.logger.warn(
            `⚠️ Tipo de notificação desconhecido: ${notificationData.type}`,
          );
          return false;
      }
    } catch (error) {
      this.logger.error(`❌ Erro ao enviar notificação:`, error);
      return false;
    }
  }

  /**
   * Enviar notificação por e-mail
   * Usa o EmailService para envio
   *
   * @param data - Dados da notificação
   * @returns Promise<boolean>
   */
  private async sendEmail(data: NotificationData): Promise<boolean> {
    try {
      return await this.emailService.sendEmail({
        to: data.recipient,
        subject: data.subject || 'Notificação - Pizzaria Massa Nostra',
        html: data.message,
      });
    } catch (error) {
      this.logger.error('❌ Erro ao enviar e-mail:', error);
      return false;
    }
  }

  /**
   * Enviar notificação por SMS
   * TODO: Implementar integração com Twilio ou similar
   *
   * @param data - Dados da notificação
   * @returns Promise<boolean>
   */
  private async sendSMS(data: NotificationData): Promise<boolean> {
    // TODO: Futura integração com Twilio
    this.logger.warn('⚠️ Envio de SMS ainda não implementado');
    this.logger.debug(
      `SMS seria enviado para: ${data.recipient} - Mensagem: ${data.message}`,
    );

    // Quando implementar Twilio:
    // const twilioService = new TwilioService();
    // return await twilioService.sendSMS(data.recipient, data.message);

    return false;
  }

  /**
   * Enviar push notification
   * TODO: Implementar integração com Firebase Cloud Messaging
   *
   * @param data - Dados da notificação
   * @returns Promise<boolean>
   */
  private async sendPush(data: NotificationData): Promise<boolean> {
    // TODO: Futura integração com Firebase FCM
    this.logger.warn('⚠️ Push notification ainda não implementado');
    this.logger.debug(
      `Push seria enviado para: ${data.recipient} - Mensagem: ${data.message}`,
    );

    // Quando implementar Firebase:
    // const fcmService = new FCMService();
    // return await fcmService.sendPush(data.recipient, data.message, data.data);

    return false;
  }

  // ============================================
  // MÉTODOS AUXILIARES ESPECÍFICOS
  // ============================================

  /**
   * Notificar administradores sobre novo pedido
   * Envia e-mail para LOG_EMAIL configurado no . env
   *
   * @param orderNumber - Número do pedido
   * @param customerName - Nome do cliente
   * @param total - Valor total do pedido
   * @returns Promise<boolean>
   */
  async notifyNewOrder(
    orderNumber: string,
    customerName: string,
    total: number,
  ): Promise<boolean> {
    const message = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #d32f2f;">🔔 Novo Pedido Recebido! </h2>
        <table style="width: 100%; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <strong>Número do Pedido:</strong>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              #${orderNumber}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <strong>Cliente:</strong>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              ${customerName}
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              <strong>Valor Total:</strong>
            </td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              R$ ${total.toFixed(2)}
            </td>
          </tr>
        </table>
        <p style="margin-top: 20px; color: #666;">
          Acesse o painel administrativo para processar o pedido. 
        </p>
      </div>
    `;

    const adminEmail = process.env.LOG_EMAIL || 'pizzariamassanostra@gmail.com';

    return await this.send({
      type: NotificationType.EMAIL,
      recipient: adminEmail,
      subject: `🔔 Novo Pedido #${orderNumber} - R$ ${total.toFixed(2)}`,
      message,
    });
  }

  /**
   * Notificar cliente sobre mudança de status do pedido
   *
   * @param email - E-mail do cliente
   * @param orderNumber - Número do pedido
   * @param status - Status atual
   * @returns Promise<boolean>
   */
  async notifyOrderStatus(
    email: string,
    orderNumber: string,
    status: string,
  ): Promise<boolean> {
    // Validar se cliente tem e-mail
    if (!email || email.trim() === '') {
      this.logger.warn(
        `⚠️ Cliente sem e-mail cadastrado - Pedido #${orderNumber}`,
      );
      return false;
    }

    // Usar método específico do EmailService
    return await this.emailService.sendOrderStatusEmail(
      email,
      orderNumber,
      status,
    );
  }

  /**
   * Enviar e-mail de boas-vindas para novo cliente
   *
   * @param email - E-mail do cliente
   * @param customerName - Nome do cliente
   * @returns Promise<boolean>
   */
  async sendWelcomeEmail(
    email: string,
    customerName: string,
  ): Promise<boolean> {
    if (!email) {
      return false;
    }

    return await this.emailService.sendWelcomeEmail(email, customerName);
  }
}
