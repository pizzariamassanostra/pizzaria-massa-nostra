// ============================================
// MODULE: CLIENTES (COMMON USERS)
// ============================================
// Módulo completo de gestão de clientes
// Pizzaria Massa Nostra
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CommonUser } from './entities/common-user.entity';
import { CommonUserController } from './controllers/common-user.controller';
import { CustomerController } from './controllers/customer.controller';
import { CommonUserRepository } from './repositories/common-user.repository';
import { FindOneCommonUserService } from './services/find-one-common-user.service';
import { CustomerService } from './services/customer.service';
import { CreateCommonUserService } from './services/create-common-user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommonUser]),
    // ⭐ IMPORTAR JwtModule
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [CommonUserController, CustomerController],
  providers: [
    CommonUserRepository,
    FindOneCommonUserService,
    CreateCommonUserService,
    CustomerService,
  ],
  exports: [FindOneCommonUserService, CreateCommonUserService, CustomerService],
})
export class CommonUserModule {}
