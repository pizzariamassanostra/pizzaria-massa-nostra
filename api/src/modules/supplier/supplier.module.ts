// ============================================
// MODULO: FORNECEDORES
// ============================================
// Registra providers, controllers e exports
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { SupplierQuote } from './entities/supplier-quote.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { SupplierEvaluation } from './entities/supplier-evaluation.entity';
import { SupplierService } from './services/supplier.service';
import { SupplierQuoteService } from './services/supplier-quote.service';
import { PurchaseOrderService } from './services/purchase-order.service';
import { SupplierController } from './controllers/supplier.controller';
import { SupplierEvaluationService } from './services/supplier-evaluation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Supplier,
      SupplierQuote,
      PurchaseOrder,
      SupplierEvaluation,
    ]),
  ],
  controllers: [SupplierController],
  providers: [
    SupplierService,
    SupplierQuoteService,
    PurchaseOrderService,
    SupplierEvaluationService,
  ],
  exports: [
    SupplierService,
    SupplierQuoteService,
    PurchaseOrderService,
    SupplierEvaluationService,
  ],
})
export class SupplierModule {}
