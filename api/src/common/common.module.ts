import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from '../modules/rbac/entities/user-role.entity';

// Módulo comum que exporta a configuração do TypeORM para uso em outros módulos
@Module({
  // Registra a entidade UserRole para usar com TypeORM
  imports: [TypeOrmModule.forFeature([UserRole])],

  // Exporta TypeOrmModule para que outros módulos possam utilizar
  exports: [TypeOrmModule],
})
export class CommonModule {}
