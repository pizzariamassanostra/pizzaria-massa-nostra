// ============================================
// ENTITY: COMPROVANTE
// ============================================
// Entidade de comprovantes de pedidos
// Pizzaria Massa Nostra
// ============================================

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../order/entities/order.entity';
import { CommonUser } from '../../common-user/entities/common-user.entity';

@Entity('receipts')
export class Receipt {
  // ============================================
  // IDENTIFICAÇÃO
  // ============================================
  @PrimaryGeneratedColumn()
  id: number;

  // ============================================
  // RELACIONAMENTOS
  // ============================================
  @ManyToOne(() => Order, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  order_id: number;

  @ManyToOne(() => CommonUser, { nullable: false })
  @JoinColumn({ name: 'customer_id' })
  customer: CommonUser;

  @Column({ name: 'customer_id' })
  customer_id: number;

  // ============================================
  // DADOS DO COMPROVANTE
  // ============================================
  @Column({ type: 'varchar', length: 50, unique: true })
  receipt_number: string; // Ex: COMP-20250124-001

  @Column({ type: 'varchar', length: 500 })
  pdf_url: string; // URL do PDF no Cloudinary

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'varchar', length: 50 })
  payment_method: string; // pix, dinheiro, cartao_debito, cartao_credito

  // ============================================
  // DADOS DO CLIENTE (SNAPSHOT)
  // ============================================
  @Column({ type: 'varchar', length: 255 })
  customer_name: string;

  @Column({ type: 'varchar', length: 14, nullable: true })
  customer_cpf: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customer_email: string;

  @Column({ type: 'varchar', length: 15 })
  customer_phone: string;

  // ============================================
  // METADADOS
  // ============================================
  @Column({ type: 'text', nullable: true })
  items_json: string; // JSON dos itens do pedido

  @Column({ type: 'boolean', default: false })
  was_emailed: boolean; // Se foi enviado por email

  // ============================================
  // DATAS
  // ============================================
  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  emailed_at: Date;
}
