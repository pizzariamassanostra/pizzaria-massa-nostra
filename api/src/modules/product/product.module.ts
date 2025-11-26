// ============================================
// MODULO: PRODUTOS
// ============================================
// Produtos do cardápio
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { PizzaCrust } from './entities/pizza-crust.entity';
import { CrustFilling } from './entities/crust-filling.entity';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { CrustService } from './services/crust.service';
import { FillingService } from './services/filling.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      PizzaCrust,
      CrustFilling,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, CrustService, FillingService],
  exports: [ProductService, CrustService, FillingService],
})
export class ProductModule {}
