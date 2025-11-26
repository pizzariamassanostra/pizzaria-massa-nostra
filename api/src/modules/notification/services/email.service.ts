// ===========================================
// EMAIL SERVICE - PIZZARIA MASSA NOSTRA
// Serviço de envio de e-mails usando SendGrid
// ===========================================

import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

/**
 * Interface para dados do e-mail
 */
interface EmailData {
  to: string; // E-mail do destinatário
  subject: string; // Assunto do e-mail
  html: string; // Conteúdo HTML do e-mail
  attachments?: Array<{
    // Anexos (opcional)
    content: string; // Conteúdo em base64
    filename: string; // Nome do arquivo
    type: string; // Tipo MIME (ex: application/pdf)
    disposition: string; // 'attachment' ou 'inline'
  }>;
}

@Injectable()
export class EmailService {
  // Logger para rastrear envios e erros
  private readonly logger = new Logger(EmailService.name);

  // E-mail remetente (configurado no . env)
  private readonly fromEmail: string;
  private readonly fromName: string;

  constructor(private configService: ConfigService) {
    // Configurar SendGrid com API Key
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');

    if (!apiKey) {
      this.logger.error('❌ SENDGRID_API_KEY não configurado no .env');
      throw new Error('SendGrid API Key não encontrado');
    }

    sgMail.setApiKey(apiKey);

    // Obter dados do remetente
    this.fromEmail = this.configService.get<string>('SENDGRID_FROM_EMAIL');
    this.fromName =
      this.configService.get<string>('SENDGRID_FROM_NAME') ||
      'Pizzaria Massa Nostra';

    this.logger.log(
      `✅ EmailService inicializado - Remetente: ${this.fromName} <${this.fromEmail}>`,
    );
  }

  /**
   * Enviar e-mail
   * @param emailData - Dados do e-mail
   * @returns Promise<boolean> - true se enviado com sucesso
   */
  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      // Validar e-mail do destinatário
      if (!emailData.to || !this.isValidEmail(emailData.to)) {
        this.logger.warn(`⚠️ E-mail inválido: ${emailData.to}`);
        return false;
      }

      // Montar mensagem
      const msg = {
        to: emailData.to,
        from: {
          email: this.fromEmail,
          name: this.fromName,
        },
        subject: emailData.subject,
        html: emailData.html,
        attachments: emailData.attachments || [],
      };

      // Enviar via SendGrid
      this.logger.log(`📧 Enviando e-mail para: ${emailData.to}`);
      await sgMail.send(msg);

      this.logger.log(`✅ E-mail enviado com sucesso para: ${emailData.to}`);
      return true;
    } catch (error) {
      this.logger.error(
        `❌ Erro ao enviar e-mail para ${emailData.to}:`,
        error,
      );

      // Log detalhado do erro SendGrid
      if (error.response) {
        this.logger.error('Detalhes do erro SendGrid:', error.response.body);
      }

      return false;
    }
  }

  /**
   * Validar formato de e-mail
   * @param email - E-mail a ser validado
   * @returns boolean
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Enviar e-mail de comprovante de pedido
   * @param to - E-mail do cliente
   * @param orderNumber - Número do pedido
   * @param htmlContent - Conteúdo HTML do e-mail
   * @param pdfBuffer - Buffer do PDF do comprovante
   * @returns Promise<boolean>
   */
  async sendReceiptEmail(
    to: string,
    orderNumber: string,
    htmlContent: string,
    pdfBuffer: Buffer,
  ): Promise<boolean> {
    try {
      const emailData: EmailData = {
        to,
        subject: `Comprovante de Pedido #${orderNumber} - Pizzaria Massa Nostra`,
        html: htmlContent,
        attachments: [
          {
            content: pdfBuffer.toString('base64'),
            filename: `comprovante-${orderNumber}.pdf`,
            type: 'application/pdf',
            disposition: 'attachment',
          },
        ],
      };

      return await this.sendEmail(emailData);
    } catch (error) {
      this.logger.error(`❌ Erro ao enviar comprovante para ${to}:`, error);
      return false;
    }
  }

  /**
   * Enviar e-mail de boas-vindas
   * @param to - E-mail do cliente
   * @param customerName - Nome do cliente
   * @returns Promise<boolean>
   */
  async sendWelcomeEmail(to: string, customerName: string): Promise<boolean> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Bem-vindo à Pizzaria Massa Nostra!  🍕</h2>
        <p>Olá, <strong>${customerName}</strong>! </p>
        <p>Estamos felizes em ter você conosco! </p>
        <p>Agora você pode fazer pedidos pelo nosso aplicativo e acompanhar tudo em tempo real.</p>
        <p style="margin-top: 30px;">
          <strong>Pizzaria Massa Nostra</strong><br>
          A melhor pizza da cidade!  🍕
        </p>
      </div>
    `;

    const emailData: EmailData = {
      to,
      subject: 'Bem-vindo à Pizzaria Massa Nostra!  🍕',
      html: htmlContent,
    };

    return await this.sendEmail(emailData);
  }

  /**
   * Enviar notificação de status do pedido
   * @param to - E-mail do cliente
   * @param orderNumber - Número do pedido
   * @param status - Status atual
   * @returns Promise<boolean>
   */
  async sendOrderStatusEmail(
    to: string,
    orderNumber: string,
    status: string,
  ): Promise<boolean> {
    const statusMessages = {
      confirmed: '✅ Pagamento confirmado!  Estamos preparando seu pedido.',
      preparing: '👨‍🍳 Seu pedido está sendo preparado com carinho!',
      ready: '✅ Seu pedido está pronto! ',
      out_for_delivery: '🛵 Seu pedido saiu para entrega!',
      delivered: '🎉 Pedido entregue!  Bom apetite!',
    };

    const message = statusMessages[status] || 'Status do pedido atualizado. ';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d32f2f;">Atualização do Pedido #${orderNumber}</h2>
        <p style="font-size: 18px; color: #333;">${message}</p>
        <p style="margin-top: 30px;">
          <strong>Pizzaria Massa Nostra</strong><br>
          Obrigado pela preferência! 🍕
        </p>
      </div>
    `;

    const emailData: EmailData = {
      to,
      subject: `Pedido #${orderNumber} - ${message}`,
      html: htmlContent,
    };

    return await this.sendEmail(emailData);
  }
}
