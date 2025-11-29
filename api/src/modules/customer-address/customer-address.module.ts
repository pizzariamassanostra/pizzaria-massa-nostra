import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerAddressController } from './controllers/customer-address.controller';
import { CustomerAddressService } from './services/customer-address.service';
import { Address } from '../order/entities/address.entity';
import { CommonUser } from '../common-user/entities/common-user.entity';

// Módulo de gerenciamento de endereços de clientes
@Module({
  imports: [TypeOrmModule.forFeature([Address, CommonUser])],
  controllers: [CustomerAddressController],
  providers: [CustomerAddressService],
})
export class CustomerAddressModule {}
