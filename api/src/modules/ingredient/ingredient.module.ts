// ============================================
// MODULO: INGREDIENTES E ESTOQUE
// ============================================
// Registra providers, controllers e exports
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { Stock } from './entities/stock.entity';
import { StockMovement } from './entities/stock-movement.entity';
import { StockAlert } from './entities/stock-alert.entity';
import { IngredientService } from './services/ingredient.service';
import { StockService } from './services/stock.service';
import { StockMovementService } from './services/stock-movement.service';
import { IngredientController } from './controllers/ingredient.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingredient, Stock, StockMovement, StockAlert]),
  ],
  controllers: [IngredientController],
  providers: [IngredientService, StockService, StockMovementService],
  exports: [IngredientService, StockService, StockMovementService],
})
export class IngredientModule {}
