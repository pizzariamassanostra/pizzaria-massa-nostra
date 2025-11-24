// ============================================
// MÓDULO: PAGAMENTOS
// ============================================
// Gerencia pagamentos via Mercado Pago
// Pizzaria Massa Nostra
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { CommonUserModule } from '../common-user/common-user.module';
import { PaymentController } from './controllers/payment.controller';
import { PaymentRepository } from './repositories/payment.repository';
import { QueryPaymentService } from './services/find-one-payment.service';

@Module({
  controllers: [PaymentController],
  imports: [TypeOrmModule.forFeature([Payment]), CommonUserModule],
  providers: [QueryPaymentService, PaymentRepository],
  exports: [QueryPaymentService],
})
export class PaymentModule {}
