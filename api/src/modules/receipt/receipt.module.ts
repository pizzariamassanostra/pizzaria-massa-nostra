// ============================================
// MODULO: COMPROVANTES
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from './entities/receipt.entity';

// Usar path relativo ao invés de alias @/
import { Order } from '../order/entities/order.entity';

import { ReceiptRepository } from './repositories/receipt.repository';
import { ReceiptService } from './services/receipt.service';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { ReceiptController } from './controllers/receipt.controller';

// Usar path relativo
import { CloudinaryService } from '../../common/libs/cloudinary/cloudinary.service';

// Importar NotificationModule para envio de e-mails
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receipt, Order]),
    NotificationModule, // Adicionar módulo de notificações
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
