// ===========================================
// NOTIFICATION MODULE - PIZZARIA MASSA NOSTRA
// Módulo de notificações (E-mail, SMS, Push, WebSocket)
//
// Referência: PIZZARIA-FASE-FINAL-COMPLETAR-MODULOS-PENDENTES
// Data: 2025-11-26 02:15:00 UTC
// Desenvolvedor: @lucasitdias
// Status: ✅ Implementado + Testes
// ===========================================

import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { NotificationService } from './services/notification.service';
import { NotificationGateway } from './notification.gateway';
import { TestEmailController } from './test-email.controller'; // ← ADICIONAR

@Module({
  controllers: [
    TestEmailController, // ← ADICIONAR (REMOVER APÓS TESTES)
  ],
  providers: [EmailService, NotificationService, NotificationGateway],
  exports: [EmailService, NotificationService, NotificationGateway],
})
export class NotificationModule {}
