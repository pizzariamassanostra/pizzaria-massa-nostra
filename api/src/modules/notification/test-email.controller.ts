// ===========================================
// TEST EMAIL CONTROLLER
// Controller para testar envio de e-mails
// ===========================================

import { Controller, Post, Body, Get } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EmailService } from './services/email.service';
import { NotificationService } from './services/notification.service';

/**
 * DTO para teste de e-mail
 */
class TestEmailDto {
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsOptional()
  @IsString()
  customerName?: string;
}

@Controller('test-email')
export class TestEmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * TESTE 1: Enviar e-mail de boas-vindas
   * POST http://localhost:3001/test-email/welcome
   * Body: { "email": "seu-email@gmail.com", "customerName": "Seu Nome" }
   */
  @Post('welcome')
  async testWelcomeEmail(@Body() data: TestEmailDto) {
    console.log('Dados recebidos:', data);
    console.log('E-mail:', data.email);
    const result = await this.emailService.sendWelcomeEmail(
      data.email,
      data.customerName || 'Cliente Teste',
    );

    return {
      ok: result,
      message: result
        ? 'E-mail de boas-vindas enviado com sucesso!'
        : 'Falha ao enviar e-mail',
      sentTo: data.email,
    };
  }

  /**
   * TESTE 2: Enviar e-mail de status de pedido
   * POST http://localhost:3001/test-email/order-status
   * Body: { "email": "seu-email@gmail.com" }
   */
  @Post('order-status')
  async testOrderStatusEmail(@Body() data: TestEmailDto) {
    const result = await this.emailService.sendOrderStatusEmail(
      data.email,
      'ORD-20251126-TEST',
      'confirmed',
    );

    return {
      ok: result,
      message: result
        ? 'E-mail de status enviado com sucesso!'
        : 'Falha ao enviar e-mail',
      sentTo: data.email,
    };
  }

  /**
   * TESTE 3: Enviar notificação de novo pedido (admin)
   * POST http://localhost:3001/test-email/new-order
   */
  @Post('new-order')
  async testNewOrderNotification() {
    const result = await this.notificationService.notifyNewOrder(
      'ORD-20251126-TEST',
      'João Silva Teste',
      95.5,
    );

    return {
      ok: result,
      message: result
        ? 'Notificação de novo pedido enviada!'
        : 'Falha ao enviar notificação',
      sentTo: process.env.LOG_EMAIL || 'pizzariamassanostra@gmail. com',
    };
  }

  /**
   * TESTE 4: Verificar configuração
   * GET http://localhost:3001/test-email/config
   */
  @Get('config')
  async checkConfig() {
    return {
      sendgrid: {
        configured: !!process.env.SENDGRID_API_KEY,
        fromEmail: process.env.SENDGRID_FROM_EMAIL,
        fromName: process.env.SENDGRID_FROM_NAME,
      },
      logEmail: process.env.LOG_EMAIL,
    };
  }
}
