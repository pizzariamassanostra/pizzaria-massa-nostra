// ============================================
// MODULO: PEDIDOS E ENDEREÇOS (COMPLETO)
// ============================================
// Gestão de pedidos
// Inclui integração com comprovantes PDF
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ============================================
// ENTITIES (ENTIDADES)
// ============================================
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { Address } from './entities/address.entity';
import { OrderReview } from './entities/review.entity';

// ============================================
// ENTITIES DE PRODUTOS (RELACIONAMENTO)
// ============================================
import { ProductVariant } from '../product/entities/product-variant.entity';
import { PizzaCrust } from '../product/entities/pizza-crust.entity';
import { CrustFilling } from '../product/entities/crust-filling.entity';

// ============================================
// CONTROLLERS (CONTROLADORES)
// ============================================
import { OrderController } from './controllers/order.controller';
import { WebhookController } from './controllers/webhook.controller';
import { ReviewController } from './controllers/review.controller';

// ============================================
// SERVICES (SERVIÇOS)
// ============================================
import { OrderService } from './services/order.service';
import { AddressService } from './services/address.service';
import { MercadoPagoService } from './services/mercadopago.service';
import { ReviewService } from './services/review.service';

// ============================================
// MÓDULOS EXTERNOS
// ============================================
import { ReceiptModule } from '../receipt/receipt.module'; // Comprovantes

@Module({
  // ============================================
  // IMPORTS (IMPORTAÇÕES)
  // ============================================
  imports: [
    // Registrar entidades no TypeORM
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      OrderStatusHistory,
      OrderReview,
      Address,
      ProductVariant,
      PizzaCrust,
      CrustFilling,
    ]),

    ReceiptModule, // Permite usar ReceiptService em OrderService
  ],

  // ============================================
  // CONTROLLERS (ROTAS)
  // ============================================
  controllers: [
    OrderController, // Rotas de pedidos
    ReviewController, // Rotas de avaliações
    WebhookController, // Webhook MercadoPago
  ],

  // ============================================
  // PROVIDERS (SERVIÇOS)
  // ============================================
  providers: [
    OrderService, // Lógica de pedidos
    ReviewService, // Lógica de avaliações
    AddressService, // Lógica de endereços
    MercadoPagoService, // Integração pagamentos
  ],

  // ============================================
  // EXPORTS (EXPORTAÇÕES)
  // ============================================
  exports: [
    OrderService, // Permite outros módulos usarem
    AddressService,
    MercadoPagoService,
  ],
})
export class OrderModule {}
