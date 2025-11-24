// ============================================
// ENTIDADE: PEDIDOS
// ============================================
// Pedidos realizados pelos clientes
// Pizzaria Massa Nostra
// ============================================

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CommonUser } from '../../common-user/entities/common-user.entity';
import { Address } from './address.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  // ============================================
  // IDENTIFICAÇÃO
  // ============================================
  @PrimaryGeneratedColumn()
  id: number;

  // ============================================
  // RELACIONAMENTOS
  // ============================================
  // Cliente que fez o pedido
  @Column()
  common_user_id: number;

  @ManyToOne(() => CommonUser)
  @JoinColumn({ name: 'common_user_id' })
  user: CommonUser;

  // Endereço de entrega
  @Column({ nullable: true })
  address_id: number;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  // ============================================
  // STATUS DO PEDIDO
  // ============================================
  // pending, confirmed, preparing, on_delivery, delivered, cancelled
  @Column({ length: 50, default: 'pending' })
  status: string;

  // ============================================
  // VALORES DO PEDIDO
  // ============================================
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number; // Soma dos itens

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  delivery_fee: number; // Taxa de entrega

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number; // Desconto aplicado

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number; // Total final (subtotal + delivery_fee - discount)

  // ============================================
  // PAGAMENTO
  // ============================================
  @Column({ length: 50, nullable: true })
  payment_method: string; // pix, dinheiro, cartao_debito, cartao_credito

  // Referência ao pagamento (temporário até refatoração do módulo payment)
  @Column({ length: 255, nullable: true })
  payment_reference: string;

  // ============================================
  // ENTREGA
  // ============================================
  // Token de entrega (6 dígitos gerado automaticamente)
  @Column({ length: 10, nullable: true })
  delivery_token: string;

  // Observações do cliente
  @Column({ type: 'text', nullable: true })
  notes: string;

  // Tempo estimado de entrega (em minutos)
  @Column({ nullable: true })
  estimated_time: number;

  // ============================================
  // ITENS DO PEDIDO
  // ============================================
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  // ============================================
  // AUDITORIA
  // ============================================
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', select: false })
  deleted_at: Date;
  user_id: number;
  customer: any;
  total_amount: any;
  customer_id: any;
}
