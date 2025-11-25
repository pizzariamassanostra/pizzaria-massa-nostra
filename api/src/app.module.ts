// ============================================
// MÓDULO PRINCIPAL DA APLICAÇÃO
// ============================================
// Este é o módulo raiz que importa todos os outros módulos
// e configura TypeORM, Schedule, Config, etc.
// Pizzaria Massa Nostra
// Desenvolvedor: @lucasitdias
// ============================================

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { config } from 'dotenv';

// ============================================
// IMPORTAR MÓDULOS DA APLICAÇÃO
// ============================================
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

// ============================================
// 🆕 FUTUROS MÓDULOS (DESCOMENTAR QUANDO CRIAR)
// ============================================
import { SupplierModule } from './modules/supplier/supplier.module';
import { IngredientModule } from './modules/ingredient/ingredient.module';
// import { StockModule } from './modules/stock/stock.module';
// import { PermissionModule } from './modules/permission/permission.module';
// import { WhatsappModule } from './modules/whatsapp/whatsapp.module';

// Carrega variáveis de ambiente (.env)
config();

@Module({
  imports: [
    // ============================================
    // CONFIG MODULE - Carrega .env
    // ============================================
    // Torna variáveis de ambiente disponíveis globalmente
    ConfigModule.forRoot({
      isGlobal: true, // Disponível em toda aplicação sem precisar importar
      envFilePath: '.env', // Arquivo de configuração
    }),

    // ============================================
    // SCHEDULE MODULE - Tarefas agendadas (cron)
    // ============================================
    // Permite criar jobs agendados (ex: limpar logs diariamente)
    ScheduleModule.forRoot(),

    // ============================================
    // TYPEORM MODULE - Conexão com Supabase
    // ============================================
    TypeOrmModule.forRoot({
      type: 'postgres', // Supabase usa PostgreSQL

      // ============================================
      // CREDENCIAIS SUPABASE (vindas do .env)
      // ============================================
      host: process.env.DB_HOST, // db.immtupjumavgpefcvzpg.supabase.co
      port: Number(process.env.DB_PORT), // 5432
      username: process.env.DB_USERNAME, // postgres
      password: process.env.DB_PASSWORD, // Pizza@Massa@Nostra
      database: process.env.DB_DATABASE, // postgres

      // ============================================
      // ENTIDADES (MODELOS) - AUTO-DISCOVERY
      // ============================================
      // TypeORM vai buscar automaticamente todos os arquivos .entity.ts
      entities: [__dirname + '/**/*.entity{.ts,.js}'],

      // ============================================
      // SYNCHRONIZE - CRIAÇÃO AUTOMÁTICA DE TABELAS
      // ============================================
      // ATENÇÃO: APENAS TRUE EM DESENVOLVIMENTO!
      // Em produção, SEMPRE usar false e criar tabelas via migrations
      synchronize: false, // TRUE: Cria tabelas automaticamente

      // ============================================
      // LOGGING - EXIBE QUERIES SQL NO CONSOLE
      // ============================================
      // Útil para debug em desenvolvimento
      logging: process.env.NODE_ENV === 'development',

      // ============================================
      // SSL - OBRIGATÓRIO PARA SUPABASE
      // ============================================
      ssl: {
        rejectUnauthorized: false, // Aceita certificados auto-assinados
      },
    }),

    // ============================================
    // MÓDULOS ATIVOS DA APLICAÇÃO
    // ============================================

    // AUTENTICAÇÃO E USUÁRIOS
    AuthModule, // Login JWT (admin e cliente)
    CommonUserModule, // Cadastro e gestão de clientes
    AdminUserModule, // Usuários admin (gestão interna)

    // PAGAMENTOS
    PaymentModule, // Integração MercadoPago + Webhook

    // PRODUTOS
    ProductCategoryModule, // Categorias (Pizzas Salgadas, Doces, Bebidas...)
    ProductModule, // Produtos e variações (P, M, G)

    // PEDIDOS
    OrderModule, // Criação, atualização, histórico de pedidos

    // COMPROVANTES
    ReceiptModule, // Geração de comprovantes PDF

    // NOTIFICAÇÕES
    NotificationModule, // WebSocket para notificações em tempo real

    // RELATÓRIOS
    ReportsModule, // Dashboard, vendas, clientes, etc

    // ============================================
    // 🆕 FUTUROS MÓDULOS (DESCOMENTAR QUANDO CRIAR)
    // ============================================
    SupplierModule, // Gestão de fornecedores
    IngredientModule, // Cadastro de insumos
    // StockModule,         // Controle de estoque
    // PermissionModule,    // Níveis de acesso (admin, gerente, etc)
    // WhatsappModule,      // Integração WhatsApp Business
  ],
})
export class AppModule {}
