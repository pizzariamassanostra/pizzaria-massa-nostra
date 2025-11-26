// ============================================
// MÓDULO: PAGAMENTOS
// ============================================
// Gerencia pagamentos via Mercado Pago
// Inclui webhook e notificações
//
// Pizzaria Massa Nostra
// Referência: PIZZARIA-FASE-FINAL-COMPLETAR-MODULOS-PENDENTES
// Data: 2025-11-26 04:00:00 UTC
// Desenvolvedor: @lucasitdias
// Status: ✅ Completo com E-mail
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
import { ReceiptModule } from '../receipt/receipt.module'; // ✅ NOVO: Para gerar comprovantes
import { NotificationModule } from '../notification/notification.module'; // ✅ NOVO: Para enviar e-mails

// ============================================
// CONTROLLERS
// ============================================
import { PaymentController } from './controllers/payment.controller';
import { WebhookController } from './controllers/webhook.controller'; // ✅ NOVO

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
    WebhookController, // ✅ NOVO: Webhook do Mercado Pago
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
    ReceiptModule, // ✅ NOVO: Para gerar comprovantes
    NotificationModule, // ✅ NOVO: Para enviar e-mails e WebSocket
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
