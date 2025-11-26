// ============================================
// MODULE: COMPROVANTES
// ============================================
// Módulo de comprovantes
// Pizzaria Massa Nostra
//
// Referência: PIZZARIA-FASE-FINAL-COMPLETAR-MODULOS-PENDENTES
// Data: 2025-11-26 03:20:00 UTC
// Desenvolvedor: @lucasitdias
// Status: ✅ Completo com E-mail
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from './entities/receipt.entity';

// ✅ CORREÇÃO: Usar path relativo ao invés de alias @/
import { Order } from '../order/entities/order.entity';

import { ReceiptRepository } from './repositories/receipt.repository';
import { ReceiptService } from './services/receipt.service';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { ReceiptController } from './controllers/receipt.controller';

// ✅ CORREÇÃO: Usar path relativo
import { CloudinaryService } from '../../common/libs/cloudinary/cloudinary.service';

// ✅ NOVO: Importar NotificationModule para envio de e-mails
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receipt, Order]),
    NotificationModule, // ✅ NOVO: Adicionar módulo de notificações
  ],
  controllers: [ReceiptController],
  providers: [
    ReceiptRepository,
    ReceiptService,
    PdfGeneratorService,
    CloudinaryService,
  ],
  exports: [ReceiptService],
})
export class ReceiptModule {}
