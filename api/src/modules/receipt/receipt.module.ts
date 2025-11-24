// ============================================
// MODULE: COMPROVANTES
// ============================================
// Módulo de comprovantes
// Pizzaria Massa Nostra
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receipt } from './entities/receipt.entity';
import { Order } from '@/modules/order/entities/order.entity';
import { ReceiptRepository } from './repositories/receipt.repository';
import { ReceiptService } from './services/receipt.service';
import { PdfGeneratorService } from './services/pdf-generator.service';
import { ReceiptController } from './controllers/receipt.controller';
import { CloudinaryService } from '@/common/libs/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Receipt, Order])],
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
