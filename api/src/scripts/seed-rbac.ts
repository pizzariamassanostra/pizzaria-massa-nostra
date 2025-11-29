import { DataSource } from 'typeorm';
import { seedRBAC } from '../modules/rbac/seeds/rbac.seed';
import * as dotenv from 'dotenv';

dotenv.config();

// CONFIGURAÇÃO DO APP
const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function bootstrap() {
  try {
    console.log('Conectando ao banco de dados...');
    console.log('URL:', process.env.DATABASE_URL?.substring(0, 30) + '...');

    await AppDataSource.initialize();
    console.log('Conectado ao banco de dados');

    await seedRBAC(AppDataSource);

    await AppDataSource.destroy();
    console.log('Seed concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao executar seed:', error);
    process.exit(1);
  }
}

bootstrap();
