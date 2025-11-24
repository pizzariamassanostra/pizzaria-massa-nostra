// ============================================
// ENTIDADE: PAGAMENTOS
// ============================================
// Gerencia pagamentos via Mercado Pago
// Pizzaria Massa Nostra
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
} from 'typeorm';
import { CommonUser } from '../../common-user/entities/common-user.entity';

@Entity('payments')
export class Payment {
  // ============================================
  // IDENTIFICAÇÃO
  // ============================================
  @PrimaryGeneratedColumn('uuid')
  id: string; // UUID

  // ============================================
  // RELACIONAMENTOS
  // ============================================
  @Column({ nullable: true })
  raffle_id: string; // ⚠️ TEMPORÁRIO: Ainda referencia raffle_id até migrar para order_id

  @Column()
  common_user_id: string; // FK para common_users

  // ✅ RELACIONAMENTO CORRIGIDO (sem referência reversa)
  @ManyToOne(() => CommonUser)
  @JoinColumn({ name: 'common_user_id' })
  commonUser: CommonUser;

  // ============================================
  // DADOS DO PAGAMENTO
  // ============================================
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number; // Valor em reais (com centavos)

  @Column({ nullable: true })
  raffles_quantity: number; // ⚠️ Quantidade de rifas (legado)

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
}
