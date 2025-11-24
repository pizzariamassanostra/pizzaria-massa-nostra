// ============================================
// ENTIDADE: RECHEIOS DE BORDA
// ============================================
// Recheios para bordas Vulcão/Trançada
// Pizzaria Massa Nostra
// ============================================

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('crust_fillings')
export class CrustFilling {
  @PrimaryGeneratedColumn()
  id: number;

  // Nome do recheio
  @Column({ length: 100 })
  name: string;

  // Slug (catupiry, cheddar, etc.)
  @Column({ length: 100, unique: true })
  slug: string;

  // Descrição
  @Column({ type: 'text', nullable: true })
  description: string;

  // Preço adicional
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  // Status: active, inactive
  @Column({ length: 20, default: 'active' })
  status: string;

  // Ordem de exibição
  @Column({ default: 0 })
  sort_order: number;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', select: false })
  deleted_at: Date;
}

