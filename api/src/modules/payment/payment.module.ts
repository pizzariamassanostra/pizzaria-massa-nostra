// ============================================
// MÓDULO: PAGAMENTOS
// ============================================
// Gerencia pagamentos via Mercado Pago
// Inclui webhook e notificações
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ============================================
// ENTITIES
// ============================================
import { Payment } from './entities/payment.entity';
import { Order } from '../order/entities/order.entity';

// ============================================
// MODULES
// ============================================
import { CommonUserModule } from '../common-user/common-user.module';
import { ReceiptModule } from '../receipt/receipt.module'; // Gerar comprovantes
import { NotificationModule } from '../notification/notification.module'; // Para enviar e-mails

// ============================================
// CONTROLLERS
// ============================================
import { PaymentController } from './controllers/payment.controller';
import { WebhookController } from './controllers/webhook.controller';

// ============================================
// REPOSITORIES
// ============================================
import { PaymentRepository } from './repositories/payment.repository';

// ============================================
// SERVICES
// ============================================
import { QueryPaymentService } from './services/find-one-payment.service';
import { ValidateWebhookService } from './services/validate-payment-webhook.service';

@Module({
  // ============================================
  // CONTROLLERS
  // ============================================
  // Endpoints expostos pelo módulo
  controllers: [
    PaymentController, // Endpoints de consulta de pagamentos
    WebhookController, // Webhook do Mercado Pago
  ],

  // ============================================
  // IMPORTS
  // ============================================
  // Módulos e entidades necessárias
  imports: [
    // Registrar entidades no TypeORM
    TypeOrmModule.forFeature([Payment, Order]),

    // Módulos externos
    CommonUserModule, // Para acessar dados de usuários
    ReceiptModule, // Para gerar comprovantes
    NotificationModule, // Para enviar e-mails e WebSocket
  ],

  // ============================================
  // PROVIDERS
  // ============================================
  // Serviços e repositórios disponíveis
  providers: [
    QueryPaymentService, // Serviço de consulta de pagamentos
    PaymentRepository, // Repositório customizado
    ValidateWebhookService, // Validação de assinatura do webhook
  ],

  // ============================================
  // EXPORTS
  // ============================================
  // Serviços disponíveis para outros módulos
  exports: [
    QueryPaymentService, // Permite outros módulos consultarem pagamentos
  ],
})
export class PaymentModule {}
