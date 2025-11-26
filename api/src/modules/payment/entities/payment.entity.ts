// ============================================
// ENTIDADE: PAGAMENTOS
// ============================================
// Gerencia pagamentos via Mercado Pago
// ============================================

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  FindOperator,
} from 'typeorm';
import { CommonUser } from '../../common-user/entities/common-user.entity';

@Entity('payments')
export class Payment {
  // ============================================
  // IDENTIFICAÇÃO
  // ============================================
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ============================================
  // RELACIONAMENTOS
  // ============================================
  @Column()
  common_user_id: string;

  @ManyToOne(() => CommonUser)
  @JoinColumn({ name: 'common_user_id' })
  commonUser: CommonUser;

  // ============================================
  // DADOS DO PAGAMENTO
  // ============================================
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number; // Valor em reais (com centavos)

  @Column()
  status: string; // Status: pending, approved, rejected, cancelled

  // ============================================
  // MERCADO PAGO
  // ============================================
  @Column({ nullable: true })
  mercadopago_id: string; // ID do pagamento no Mercado Pago

  @Column({ type: 'text', nullable: true })
  pix_code: string; // Código PIX (copia e cola)

  @Column({ type: 'text', nullable: true })
  pix_qr_code: string; // QR Code PIX (base64)

  @Column({ type: 'timestamptz', nullable: true })
  expires_at: Date; // Expiração do PIX

  @Column({ type: 'timestamptz', nullable: true })
  paid_at: Date; // Data de confirmação do pagamento

  // ============================================
  // AUDITORIA
  // ============================================
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', select: false })
  deleted_at: Date;
  order_id: number | FindOperator<number>;
}
