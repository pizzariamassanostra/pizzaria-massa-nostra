// ============================================
// MÓDULO PRINCIPAL DA APLICAÇÃO
// ============================================
// Este é o módulo raiz que importa todos os outros módulos
// e configura TypeORM, Schedule, Config, etc.
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { config } from 'dotenv';

// Importar módulos da aplicação
import { AuthModule } from './modules/auth/auth.module';
import { AdminUserModule } from './modules/admin-user/admin-user.module';
import { CommonUserModule } from './modules/common-user/common-user.module';
import { PaymentModule } from './modules/payment/payment.module';
import { ProductCategoryModule } from './modules/product-category/product-category.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ReceiptModule } from './modules/receipt/receipt.module';
import { ReportsModule } from './modules/reports/reports.module';

// Carrega variáveis de ambiente (.env)
config();

@Module({
  imports: [
    // ============================================
    // CONFIG MODULE - Carrega .env
    // ============================================
    ConfigModule.forRoot({
      isGlobal: true, // Disponível em toda aplicação
      envFilePath: '.env', // Arquivo de ambiente
    }),

    // ============================================
    // SCHEDULE MODULE - Tarefas agendadas (cron)
    // ============================================
    ScheduleModule.forRoot(),

    // ============================================
    // TYPEORM MODULE - Conexão com Supabase
    // ============================================
    TypeOrmModule.forRoot({
      type: 'postgres', // Supabase usa PostgreSQL

      // Credenciais Supabase
      host: process.env.DB_HOST, // db.immtupjumavgpefcvzpg.supabase.co
      port: Number(process.env.DB_PORT), // 5432
      username: process.env.DB_USERNAME, // postgres
      password: process.env.DB_PASSWORD, // Pizza@Massa@Nostra
      database: process.env.DB_DATABASE, // postgres

      // Entidades (modelos)
      entities: [__dirname + '/**/*.entity{.ts,.js}'],

      // IMPORTANTE: synchronize: false
      // Não deixa TypeORM alterar tabelas automaticamente
      // Vamos usar migrations ou criar tabelas manualmente no Supabase
      synchronize: false,

      // Logs de SQL (útil para debug)
      logging: process.env.NODE_ENV === 'development',

      // SSL obrigatório para Supabase
      ssl: {
        rejectUnauthorized: false,
      },
    }),

    // ============================================
    // MÓDULOS DA APLICAÇÃO
    // ============================================
    AuthModule, // Autenticação JWT
    CommonUserModule, // Usuários comuns (clientes)
    AdminUserModule, // Usuários admin (gestão)
    PaymentModule, // Pagamentos (Mercado Pago)

    // MÓDULO DE CATEGORIAS
    ProductCategoryModule,

    // MÓDULO DE PRODUTOS
    ProductModule,

    // MÓDULO DE PEDIDOS
    OrderModule,

    // MÓDULO DE COMPROVANTES
    ReceiptModule,

    // GATEWAY: WEBSOCKET NOTIFICAÇÕES
    NotificationModule,

    //MÓDULO DE RELÁTORIOS
    ReportsModule,

    // 🆕 TODO: Adicionar novos módulos da pizzaria
    // - DeliveryModule (entregas)
  ],
})
export class AppModule {}
