// ============================================
// MODULE: NOTIFICAÇÕES
// ============================================
// Módulo de notificações em tempo real via WebSocket
// Pizzaria Massa Nostra
// ============================================

import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Module({
  providers: [NotificationGateway],
  exports: [NotificationGateway],
})
export class NotificationModule {}
