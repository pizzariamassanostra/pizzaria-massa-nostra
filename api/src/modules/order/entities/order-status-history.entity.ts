// ============================================
// ENTIDADE: HISTÓRICO DE STATUS DO PEDIDO
// ============================================
// Registra todas as mudanças de status
// ============================================

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { AdminUser } from '../../admin-user/entities/admin-user.entity';

@Entity('order_status_history')
export class OrderStatusHistory {
  @PrimaryGeneratedColumn()
  id: number;

  // Pedido
  @Column()
  order_id: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  // Status alterado
  @Column({ length: 50 })
  status: string;

  // Observações da mudança
  @Column({ type: 'text', nullable: true })
  notes: string;

  // Quem alterou (se foi admin)
  @Column({ nullable: true })
  created_by: number;

  @ManyToOne(() => AdminUser)
  @JoinColumn({ name: 'created_by' })
  creator: AdminUser;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
